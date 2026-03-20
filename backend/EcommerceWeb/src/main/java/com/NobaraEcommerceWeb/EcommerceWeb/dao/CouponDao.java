package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Coupon;

@Repository
public interface CouponDao extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCode(String code);
}
