package com.pawfinder.common.result;

/**
 * Error codes enumeration
 */
public enum ErrorCode {

    // Success
    SUCCESS(200, "success"),

    // Client errors
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未认证"),
    FORBIDDEN(403, "无权限"),
    NOT_FOUND(404, "资源不存在"),

    // Server errors
    INTERNAL_ERROR(500, "服务器内部错误"),
    SERVICE_UNAVAILABLE(503, "服务不可用"),
    SYSTEM_ERROR(500, "系统错误"),
    SERVICE_CALL_FAILED(504, "服务调用失败"),

    // User errors (1001-1999)
    USER_NOT_FOUND(1001, "用户不存在"),
    USER_ALREADY_EXISTS(1002, "用户已存在"),
    INVALID_CREDENTIALS(1003, "用户名或密码错误"),
    PHONE_ALREADY_EXISTS(1004, "手机号已注册"),
    INVALID_VERIFICATION_CODE(1005, "验证码错误或已过期"),
    SEND_VERIFICATION_CODE_FAIL(1006, "验证码发送失败"),
    GET_USER_INFO_FAIL(1007, "获取用户信息失败"),

    // Pet errors (2001-2999)
    PET_NOT_FOUND(2001, "宠物不存在"),
    PET_NOT_AVAILABLE(2002, "宠物不可领养"),
    GET_PET_INFO_FAIL(2003, "获取宠物信息失败"),

    // Adoption errors (3001-3999)
    APPLICATION_NOT_FOUND(3001, "申请不存在"),
    APPLICATION_STATUS_ERROR(3002, "申请状态不允许操作"),
    APPLICATION_ALREADY_EXISTS(3003, "已提交过该宠物申请"),
    APPLICATION_NOT_PENDING(3004, "申请不在待审核状态"),

    // Institution errors (4001-4999)
    INSTITUTION_NOT_FOUND(4001, "机构不存在"),

    // Order errors (5001-5999)
    ORDER_NOT_FOUND(5001, "订单不存在"),
    ORDER_EXPIRED(5002, "订单已过期"),
    ORDER_STATUS_ERROR(5003, "订单状态错误"),

    // Payment errors (6001-6999)
    PAYMENT_FAILED(6001, "支付失败"),
    TRANSACTION_NOT_FOUND(6002, "交易记录不存在"),
    PAYMENT_ERROR(6003, "支付处理错误"),

    // Search errors (7001-7999)
    SEARCH_ERROR(7001, "搜索失败"),

    // OpenFeign errors (8001-8999)
    FALLBACK_ERROR(8001, "服务降级");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
