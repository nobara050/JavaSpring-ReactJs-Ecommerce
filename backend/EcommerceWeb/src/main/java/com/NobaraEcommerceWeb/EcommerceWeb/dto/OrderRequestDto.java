package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.util.List;

import lombok.Data;

@Data
public class OrderRequestDto {
    private Long accountId;
    private Long addressId;
    private Long couponId;
    private String paymentMethod;
    private Long cartId;
    private List<OrderItemRequestDto> orderItems;
}