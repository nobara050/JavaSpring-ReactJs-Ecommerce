package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.RefreshToken;

@Repository
public interface RefreshTokenDao extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByAccount_Id(Long accountId);
}
