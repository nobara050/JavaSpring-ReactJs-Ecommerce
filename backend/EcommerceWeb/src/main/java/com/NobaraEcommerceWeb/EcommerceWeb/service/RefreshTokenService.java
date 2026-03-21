package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.RefreshTokenDao;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;
import com.NobaraEcommerceWeb.EcommerceWeb.model.RefreshToken;

@Service
public class RefreshTokenService {

    @Autowired
    RefreshTokenDao refreshTokenDao;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;

    public RefreshToken createRefreshToken(Account account) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setAccount(account);
        refreshToken.setExpiryDate(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000));
        refreshToken.setIsRevoked(false);
        return refreshTokenDao.save(refreshToken);
    }

    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenDao.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (refreshToken.getIsRevoked()) {
            throw new RuntimeException("Refresh token has been revoked");
        }

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenDao.delete(refreshToken);
            throw new RuntimeException("Refresh token has expired");
        }

        return refreshToken;
    }

    @Transactional
    public void revokeRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenDao.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));
        refreshToken.setIsRevoked(true);
        refreshTokenDao.save(refreshToken);
    }

    @Transactional
    public void revokeAllRefreshTokensByAccount(Long accountId) {
        refreshTokenDao.deleteByAccount_Id(accountId);
    }
}