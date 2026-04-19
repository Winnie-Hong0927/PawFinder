package com.pawfinder.user.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Send code request DTO
 */
public class SendCodeRequest {

    @NotBlank(message = "手机号不能为空")
    private String phone;

    public SendCodeRequest() {
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
