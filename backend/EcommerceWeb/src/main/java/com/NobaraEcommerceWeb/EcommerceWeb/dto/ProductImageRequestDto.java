package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import lombok.Data;

@Data
public class ProductImageRequestDto {
    private String imageUrl;
    private Boolean isPrimary;
}
