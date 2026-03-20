package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import lombok.Data;

@Data
public class CartItemRequestDto {
    private Long productId;
    private Integer quantity;
}