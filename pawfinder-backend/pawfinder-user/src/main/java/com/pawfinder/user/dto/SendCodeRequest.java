package com.pawfinder.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendCodeRequest {

    @NotBlank(message = "手机号不能为空")
    private String phone;
}
