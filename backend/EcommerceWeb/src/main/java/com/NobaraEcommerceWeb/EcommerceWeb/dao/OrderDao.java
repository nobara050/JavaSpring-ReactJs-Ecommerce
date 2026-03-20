package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Order;

@Repository
public interface OrderDao extends JpaRepository<Order, Long> {
    List<Order> findByAccountId(Long accountId);
}