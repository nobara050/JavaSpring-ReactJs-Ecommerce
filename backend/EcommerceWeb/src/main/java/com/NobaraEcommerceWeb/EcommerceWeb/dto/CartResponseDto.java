package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class CartResponseDto {
    private Long id;
    private Long accountId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CartItemResponseDto> cartItemList;
}
