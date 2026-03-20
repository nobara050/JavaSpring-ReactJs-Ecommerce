package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.ProductImage;

@Repository
public interface ProductImageDao extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductId(Long productId);
}
