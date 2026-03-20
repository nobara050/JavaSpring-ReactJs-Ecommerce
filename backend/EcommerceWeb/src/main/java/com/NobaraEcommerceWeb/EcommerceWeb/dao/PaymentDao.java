package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Payment;

@Repository
public interface PaymentDao extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId);
}
