package com.NobaraEcommerceWeb.EcommerceWeb.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "discounts")
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String discountName;

    private Double discountPercent;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Boolean isActive = true;

    @OneToMany(mappedBy = "discounts", cascade = CascadeType.ALL)
    private List<Product> products;
}
