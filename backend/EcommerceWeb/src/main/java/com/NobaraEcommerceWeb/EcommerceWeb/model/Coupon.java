package com.NobaraEcommerceWeb.EcommerceWeb.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String code;

    private BigDecimal discountAmount;

    private Double discountPercent;

    private BigDecimal minOrderValue;

    private Integer maxUses;

    private Integer usesCount = 0;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Boolean isActive = true;

    @OneToMany(mappedBy = "coupons", cascade = CascadeType.ALL)
    private List<Order> orders;
}
