package com.pawfinder.payment.controller;

import com.alibaba.fastjson.JSON;
import com.pawfinder.common.result.Result;
import com.pawfinder.payment.service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * 支付控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/payment/v1")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * 创建支付
     */
    @PostMapping("/create")
    public Result<Map<String, Object>> createPayment(@RequestBody Map<String, Object> request) {
        String orderId = (String) request.get("orderId");
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        
        String payForm = paymentService.createPayment(orderId, amount);
        
        Map<String, Object> result = new HashMap<>();
        result.put("payForm", payForm);
        return Result.success(result);
    }

    /**
     * 支付宝回调
     */
    @PostMapping("/callback")
    public String handleCallback(HttpServletRequest request) {
        try {
            // 获取回调参数
            Map<String, String> params = new HashMap<>();
            Enumeration<String> parameterNames = request.getParameterNames();
            while (parameterNames.hasMoreElements()) {
                String name = parameterNames.nextElement();
                params.put(name, request.getParameter(name));
            }
            
            String transactionNo = params.get("out_trade_no");
            String channelTransactionNo = params.get("trade_no");
            String tradeStatus = params.get("trade_status");
            
            log.info("支付回调: transactionNo={}, tradeStatus={}", transactionNo, tradeStatus);
            
            // 支付成功
            if ("TRADE_SUCCESS".equals(tradeStatus) || "TRADE_FINISHED".equals(tradeStatus)) {
                paymentService.handlePaymentCallback(transactionNo, channelTransactionNo, JSON.toJSONString(params));
            }
            
            return "success";
        } catch (Exception e) {
            log.error("支付回调处理失败: {}", e.getMessage());
            return "fail";
        }
    }

    /**
     * 查询支付状态
     */
    @GetMapping("/status/{transactionNo}")
    public Result<Map<String, Object>> queryStatus(@PathVariable("transactionNo") String transactionNo) {
        Map<String, Object> result = paymentService.queryPaymentStatus(transactionNo);
        return Result.success(result);
    }
}
