package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import lombok.Data;

@Data
public class NotificationRequestDto {
    private Long accountId;
    private Long orderId;
    private String message;
    private String notificationType;
}
