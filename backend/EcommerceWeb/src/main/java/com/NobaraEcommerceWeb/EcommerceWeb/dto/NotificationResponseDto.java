package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class NotificationResponseDto {
    private Long id;
    private Long accountId;
    private Long orderId;
    private String message;
    private Boolean isRead;
    private String notificationType;
    private LocalDateTime createAt;
}