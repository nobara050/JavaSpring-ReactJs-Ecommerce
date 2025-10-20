package com.NobaraEcommerceWeb.EcommerceWeb.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "purchase_order")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @CreationTimestamp
    private LocalDateTime orderDate;

    private BigDecimal totalAmount;

    private String status;

    private String shippingAddress;

    private String paymentMethod;

    private String trackingNumber;

    @ManyToOne
    private Account account;

    @ManyToOne
    private Coupon coupon;

    @ManyToOne
    private Address address;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<Notification> accountNotification;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Payment payment;
}
