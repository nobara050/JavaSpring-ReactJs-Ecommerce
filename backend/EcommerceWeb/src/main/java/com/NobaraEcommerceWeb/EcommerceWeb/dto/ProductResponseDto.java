package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class ProductResponseDto {
    private Long id;
    private String productName;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private DiscountResponseDto discount;
    private List<CategoryResponseDto> categoryList;
    private List<ProductImageResponseDto> productImageList;
}