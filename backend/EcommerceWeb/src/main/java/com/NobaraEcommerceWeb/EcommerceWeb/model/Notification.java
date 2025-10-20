package com.NobaraEcommerceWeb.EcommerceWeb.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "account_notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private Boolean isRead = false;

    @CreationTimestamp
    private LocalDateTime createAt;

    private String notificationType;

    @ManyToOne
    private Account account;

    @ManyToOne
    private Order order;
}
