package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ProductImageResponseDto {
    private Long id;
    private String imageUrl;
    private Boolean isPrimary;
    private LocalDate createdAt;
}