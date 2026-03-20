package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PaymentResponseDto {
    private Long id;
    private Long orderId;
    private Long accountId;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private String paymentStatus;
    private String transactionId;
}
