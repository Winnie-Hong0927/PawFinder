package com.pawfinder.payment.service;

import com.alibaba.fastjson.JSON;
import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.request.AlipayTradePagePayRequest;
import com.alipay.api.request.AlipayTradeQueryRequest;
import com.alipay.api.response.AlipayTradeQueryResponse;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.util.IdUtil;
import com.pawfinder.payment.entity.PaymentTransaction;
import com.pawfinder.payment.feign.OrderClient;
import com.pawfinder.payment.mapper.PaymentTransactionMapper;
import io.seata.spring.annotation.GlobalTransactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 支付服务
 * 
 * 使用 Seata AT 模式实现分布式事务
 * 支付成功后，同时更新支付流水和订单状态
 */
@Slf4j
@Service
public class PaymentService extends ServiceImpl<PaymentTransactionMapper, PaymentTransaction> {

    @Value("${alipay.app-id}")
    private String appId;

    @Value("${alipay.private-key}")
    private String privateKey;

    @Value("${alipay.public-key}")
    private String publicKey;

    @Value("${alipay.gateway-url}")
    private String gatewayUrl;

    @Value("${alipay.notify-url}")
    private String notifyUrl;

    @Value("${alipay.return-url}")
    private String returnUrl;

    @Value("${alipay.sign-type}")
    private String signType;

    @Value("${alipay.charset}")
    private String charset;

    @Value("${alipay.format}")
    private String format;

    @Autowired
    private OrderClient orderClient;

    /**
     * 创建支付流水并获取支付表单
     */
    public String createPayment(String orderId, BigDecimal amount) {
        // 生成流水号
        String transactionNo = generateTransactionNo();
        
        // 创建支付流水
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setId(UUID.randomUUID().toString());
        transaction.setTransactionNo(transactionNo);
        transaction.setOrderId(orderId);
        transaction.setAmount(amount);
        transaction.setStatus("pending");
        transaction.setPaymentChannel("alipay");
        
        save(transaction);
        log.info("创建支付流水: transactionNo={}, orderId={}, amount={}", transactionNo, orderId, amount);
        
        // 生成支付表单
        return generatePayForm(transactionNo, amount);
    }

    /**
     * 支付回调处理 - 使用 Seata AT 模式分布式事务
     * 
     * 支付成功后需要：
     * 1. 更新支付流水状态
     * 2. 调用订单服务更新订单状态
     * 
     * 使用 @GlobalTransactional 保证两个操作的原子性
     */
    @GlobalTransactional(name = "payment-callback", rollbackFor = Exception.class)
    @Transactional(rollbackFor = Exception.class)
    public void handlePaymentCallback(String transactionNo, String channelTransactionNo, String callbackData) {
        // 1. 更新支付流水
        PaymentTransaction transaction = getByTransactionNo(transactionNo);
        if (transaction == null) {
            throw new BusinessException(ErrorCode.TRANSACTION_NOT_FOUND);
        }
        
        if (!"pending".equals(transaction.getStatus())) {
            log.warn("支付流水状态已处理: transactionNo={}, status={}", transactionNo, transaction.getStatus());
            return;
        }
        
        transaction.setStatus("success");
        transaction.setChannelTransactionNo(channelTransactionNo);
        transaction.setPayTime(LocalDateTime.now());
        transaction.setCallbackData(callbackData);
        updateById(transaction);
        
        log.info("支付流水更新成功: transactionNo={}", transactionNo);
        
        // 2. 调用订单服务更新订单状态（通过 OpenFeign）
        Map<String, String> request = new HashMap<>();
        request.put("status", "paid");
        orderClient.updateStatus(transaction.getOrderId(), request);
        
        log.info("订单状态更新成功: orderId={}", transaction.getOrderId());
    }

    /**
     * 查询支付状态
     */
    public Map<String, Object> queryPaymentStatus(String transactionNo) {
        PaymentTransaction transaction = getByTransactionNo(transactionNo);
        if (transaction == null) {
            throw new BusinessException(ErrorCode.TRANSACTION_NOT_FOUND);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("transactionNo", transactionNo);
        result.put("status", transaction.getStatus());
        result.put("amount", transaction.getAmount());
        result.put("payTime", transaction.getPayTime());
        
        // 如果是待支付状态，查询支付宝
        if ("pending".equals(transaction.getStatus())) {
            try {
                AlipayClient alipayClient = getAlipayClient();
                AlipayTradeQueryRequest queryRequest = new AlipayTradeQueryRequest();
                Map<String, String> bizContent = new HashMap<>();
                bizContent.put("out_trade_no", transactionNo);
                queryRequest.setBizContent(JSON.toJSONString(bizContent));
                
                AlipayTradeQueryResponse response = alipayClient.execute(queryRequest);
                if (response.isSuccess()) {
                    result.put("tradeStatus", response.getTradeStatus());
                    result.put("tradeNo", response.getTradeNo());
                }
            } catch (AlipayApiException e) {
                log.error("查询支付宝状态失败: {}", e.getMessage());
            }
        }
        
        return result;
    }

    /**
     * 根据流水号查询
     */
    public PaymentTransaction getByTransactionNo(String transactionNo) {
        return getOne(new LambdaQueryWrapper<PaymentTransaction>()
                .eq(PaymentTransaction::getTransactionNo, transactionNo));
    }

    /**
     * 生成支付表单
     */
    private String generatePayForm(String transactionNo, BigDecimal amount) {
        try {
            AlipayClient alipayClient = getAlipayClient();
            AlipayTradePagePayRequest payRequest = new AlipayTradePagePayRequest();
            payRequest.setNotifyUrl(notifyUrl);
            payRequest.setReturnUrl(returnUrl);
            
            Map<String, Object> bizContent = new HashMap<>();
            bizContent.put("out_trade_no", transactionNo);
            bizContent.put("total_amount", amount.toString());
            bizContent.put("subject", "PawFinder领养费用");
            bizContent.put("product_code", "FAST_INSTANT_TRADE_PAY");
            payRequest.setBizContent(JSON.toJSONString(bizContent));
            
            return alipayClient.pageExecute(payRequest).getBody();
        } catch (AlipayApiException e) {
            log.error("生成支付表单失败: {}", e.getMessage());
            throw new BusinessException(ErrorCode.PAYMENT_ERROR, "生成支付表单失败");
        }
    }

    /**
     * 获取支付宝客户端
     */
    private AlipayClient getAlipayClient() {
        return new DefaultAlipayClient(gatewayUrl, appId, privateKey, format, charset, publicKey, signType);
    }

    /**
     * 生成流水号
     */
    private String generateTransactionNo() {
        return "PAY" + System.currentTimeMillis() + IdUtil.randomNumbers(6);
    }
}
