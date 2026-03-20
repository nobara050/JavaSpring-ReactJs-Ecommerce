package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class OrderResponseDto {
    private Long id;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private String trackingNumber;
    private Long accountId;
    private Long addressId;
    private Long couponId;
    private List<OrderItemResponseDto> orderItemList;
}
