package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Discount;

@Repository
public interface DiscountDao extends JpaRepository<Discount, Long> {
}