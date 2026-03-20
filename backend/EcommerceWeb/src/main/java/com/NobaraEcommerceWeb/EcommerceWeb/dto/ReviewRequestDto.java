package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import lombok.Data;

@Data
public class ReviewRequestDto {
    private Long accountId;
    private Long productId;
    private String comment;
    private Integer rating;
}
