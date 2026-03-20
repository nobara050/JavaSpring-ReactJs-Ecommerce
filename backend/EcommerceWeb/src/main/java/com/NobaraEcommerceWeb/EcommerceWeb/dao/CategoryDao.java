package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Category;

@Repository
public interface CategoryDao extends JpaRepository<Category, Long> {
    Optional<Category> findByCategoryName(String categoryName);
}