package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CouponResponseDto {
    private Long id;
    private String code;
    private BigDecimal discountAmount;
    private Double discountPercent;
    private BigDecimal minOrderValue;
    private Integer maxUses;
    private Integer usesCount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
}
