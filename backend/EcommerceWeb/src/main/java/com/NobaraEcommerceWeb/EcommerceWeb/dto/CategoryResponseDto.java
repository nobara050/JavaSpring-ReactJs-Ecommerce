package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CategoryResponseDto {
    private Long id;
    private String categoryName;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
