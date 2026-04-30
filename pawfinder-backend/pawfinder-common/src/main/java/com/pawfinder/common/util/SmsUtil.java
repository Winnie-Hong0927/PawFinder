package com.pawfinder.common.util;
import com.aliyun.dypnsapi20170525.Client;
import com.aliyun.dypnsapi20170525.models.SendSmsVerifyCodeRequest;

public class SmsUtil {
    private static final String ACCESS_KEY_ID = "LTAI5t9oSrArYJzidWzcqHZG";
    private static final String ACCESS_KEY_SECRET = "E8vAzKab9THhiPJHNavseWd32CXFVd";
    private static final String ENDPOINT = "dypnsapi.aliyuncs.com";
    private static final String SIGN_NAME = "速通互联验证码";
    private static final String TEMPLATE_CODE = "100001";
    private static final String TEMPLATE_PARAM = "{\"code\":\"%s\",\"min\":\"%d\"}";
    /**
     * 创建阿里云短信客户端
     */
    private static Client createClient() throws Exception {
        com.aliyun.credentials.Client credential = new com.aliyun.credentials.Client();
        com.aliyun.teaopenapi.models.Config config = new com.aliyun.teaopenapi.models.Config()
                .setCredential(credential)
                .setAccessKeyId(ACCESS_KEY_ID)
                .setAccessKeySecret(ACCESS_KEY_SECRET)
                .setEndpoint(ENDPOINT);
        return new com.aliyun.dypnsapi20170525.Client(config);
    }

    /**
     * 发送短信
     * @param phoneNumbers 接收手机号（多个用逗号分隔，如"13800138000,13900139000"）
     * @return 发送结果
     */
    public static void sendSms(String phoneNumbers, String code) throws Exception {
        // 创建客户端
        Client client = createClient();
        // 构建发送请求
        SendSmsVerifyCodeRequest sendSmsRequest = new SendSmsVerifyCodeRequest()
                .setPhoneNumber(phoneNumbers)
                .setSignName(SIGN_NAME)
                .setTemplateCode(TEMPLATE_CODE)
                .setTemplateParam(String.format(TEMPLATE_PARAM, code, 5));
        // 发送短信
        client.sendSmsVerifyCode(sendSmsRequest);
    }
}
