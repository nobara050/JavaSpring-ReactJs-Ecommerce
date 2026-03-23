package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CartItemResponseDto {
    private Long id;
    private Integer quantity;
    private BigDecimal priceAtAdd;
    private Long productId;
    private String productName;
    private String primaryImageUrl;
}