package com.pawfinder.common.result;

import lombok.Getter;

/**
 * Business exception with error code
 */
@Getter
public class BusinessException extends RuntimeException {

    private final int code;

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.code = errorCode.getCode();
    }

    // User errors (1001-1999)
    public static final BusinessException USER_NOT_FOUND = new BusinessException(1001, "用户不存在");
    public static final BusinessException USER_ALREADY_EXISTS = new BusinessException(1002, "用户已存在");
    public static final BusinessException INVALID_CREDENTIALS = new BusinessException(1003, "用户名或密码错误");
    public static final BusinessException PHONE_ALREADY_EXISTS = new BusinessException(1004, "手机号已注册");
    public static final BusinessException INVALID_VERIFICATION_CODE = new BusinessException(1005, "验证码错误或已过期");
    public static final BusinessException UNAUTHORIZED = new BusinessException(401, "未认证");
    public static final BusinessException FORBIDDEN = new BusinessException(403, "无权限");

    // Pet errors (2001-2999)
    public static final BusinessException PET_NOT_FOUND = new BusinessException(2001, "宠物不存在");
    public static final BusinessException PET_NOT_AVAILABLE = new BusinessException(2002, "宠物不可领养");

    // Adoption errors (3001-3999)
    public static final BusinessException APPLICATION_NOT_FOUND = new BusinessException(3001, "申请不存在");
    public static final BusinessException APPLICATION_STATUS_ERROR = new BusinessException(3002, "申请状态不允许操作");
    public static final BusinessException APPLICATION_ALREADY_EXISTS = new BusinessException(3003, "已提交过该宠物申请");
    public static final BusinessException APPLICATION_NOT_PENDING = new BusinessException(3004, "只能审核待处理的申请");

    // Institution errors (4001-4999)
    public static final BusinessException INSTITUTION_NOT_FOUND = new BusinessException(4001, "机构不存在");
    public static final BusinessException INSTITUTION_NAME_DUPLICATE = new BusinessException(4002, "机构名称已存在");

    // Order errors (5001-5999)
    public static final BusinessException ORDER_NOT_FOUND = new BusinessException(5001, "订单不存在");
    public static final BusinessException ORDER_EXPIRED = new BusinessException(5002, "订单已过期");
    public static final BusinessException ORDER_STATUS_ERROR = new BusinessException(5003, "订单状态不允许操作");

    // Payment errors (6001-6999)
    public static final BusinessException PAYMENT_FAILED = new BusinessException(6001, "支付失败");
    public static final BusinessException PAYMENT_CALLBACK_ERROR = new BusinessException(6002, "支付回调处理失败");
}
