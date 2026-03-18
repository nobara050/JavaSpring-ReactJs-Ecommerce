package com.NobaraEcommerceWeb.EcommerceWeb.dao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Cart;

@Repository
public interface CartItemDao extends JpaRepository<Cart, Long> {
}
