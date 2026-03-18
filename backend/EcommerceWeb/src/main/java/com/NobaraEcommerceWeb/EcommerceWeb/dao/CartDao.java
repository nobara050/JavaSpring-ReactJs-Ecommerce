package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Cart;

@Repository
public interface CartDao extends JpaRepository<Cart, Long> {
    Optional<Cart> findByAccountId(Long accountId);
}
