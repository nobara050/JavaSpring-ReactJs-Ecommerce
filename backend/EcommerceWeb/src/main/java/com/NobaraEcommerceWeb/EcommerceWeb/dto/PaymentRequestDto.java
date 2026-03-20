package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PaymentRequestDto {
    private Long orderId;
    private Long accountId;
    private BigDecimal amount;
    private String paymentStatus;
    private String transactionId;
}
