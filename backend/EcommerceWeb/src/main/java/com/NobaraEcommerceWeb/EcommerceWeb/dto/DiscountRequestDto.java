package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class DiscountRequestDto {
    private String discountName;
    private BigDecimal discountAmount;
    private Double discountPercent;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
}
