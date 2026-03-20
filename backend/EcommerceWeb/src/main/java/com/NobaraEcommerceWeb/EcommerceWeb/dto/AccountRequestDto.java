package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import lombok.Data;

@Data
public class AccountRequestDto {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String phone;
    private String avatar;
}