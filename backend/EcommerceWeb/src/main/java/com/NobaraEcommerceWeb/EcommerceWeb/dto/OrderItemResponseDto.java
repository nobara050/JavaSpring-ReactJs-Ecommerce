package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class OrderItemResponseDto {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
}
