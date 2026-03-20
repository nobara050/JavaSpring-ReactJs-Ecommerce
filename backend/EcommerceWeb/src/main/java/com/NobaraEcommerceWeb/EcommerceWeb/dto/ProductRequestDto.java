package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class ProductRequestDto {
    private String productName;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Boolean isActive;
    private Long discountId;
    private List<Long> categoryIds;
}