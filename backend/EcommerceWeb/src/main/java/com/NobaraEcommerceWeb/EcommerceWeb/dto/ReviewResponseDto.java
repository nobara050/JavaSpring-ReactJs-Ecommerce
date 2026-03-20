package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ReviewResponseDto {
    private Long id;
    private Long accountId;
    private Long productId;
    private String productName;
    private String comment;
    private Integer rating;
    private LocalDateTime createAt;
}
