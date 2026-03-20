package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Review;

@Repository
public interface ReviewDao extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);
    List<Review> findByAccountId(Long accountId);
}