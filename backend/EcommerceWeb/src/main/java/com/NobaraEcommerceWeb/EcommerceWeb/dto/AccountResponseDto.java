package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class AccountResponseDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String avatar;
    private Boolean isActive;
    private Date createdAt;
}
