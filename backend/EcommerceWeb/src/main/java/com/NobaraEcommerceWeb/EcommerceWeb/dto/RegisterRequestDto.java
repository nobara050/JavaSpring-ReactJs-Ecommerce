package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import lombok.Data;

@Data
public class RegisterRequestDto {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String phone;
}
