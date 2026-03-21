package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDto {
    private String accessToken;
    private String refreshToken;
    private String username;
    private String email;
}
