package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Product;

@Repository
public interface ProductDao extends JpaRepository<Product, Long> {
}
