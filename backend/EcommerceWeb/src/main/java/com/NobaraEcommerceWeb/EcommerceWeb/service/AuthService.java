package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.RoleDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.AuthResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.LoginRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.RegisterRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;
import com.NobaraEcommerceWeb.EcommerceWeb.model.RefreshToken;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Role;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;

@Service
public class AuthService {

    @Autowired
    AccountDao accountDao;

    @Autowired
    RoleDao roleDao;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtService jwtService;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    AuthenticationManager authenticationManager;

    public AuthResponseDto register(RegisterRequestDto dto) {
        if (accountDao.findByUsername(dto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists: " + dto.getUsername());
        }

        if (accountDao.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
        }

        Role userRole = findRoleByName("USER");

        Account account = new Account();
        account.setUsername(dto.getUsername());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));
        account.setEmail(dto.getEmail());
        account.setFullName(dto.getFullName());
        account.setPhone(dto.getPhone());
        account.setRole(List.of(userRole));
        account.setIsActive(true);

        Account saved = accountDao.save(account);

        UserDetails userDetails = userDetailsService.loadUserByUsername(saved.getUsername());
        String accessToken = jwtService.generateAccessToken(userDetails);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(saved);

        return new AuthResponseDto(accessToken, refreshToken.getToken(), saved.getUsername(), saved.getEmail());
    }

    public AuthResponseDto login(LoginRequestDto dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );

        Account account = accountDao.findByUsername(dto.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(account.getUsername());
        String accessToken = jwtService.generateAccessToken(userDetails);

        refreshTokenService.revokeAllRefreshTokensByAccount(account.getId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(account);

        return new AuthResponseDto(accessToken, refreshToken.getToken(), account.getUsername(), account.getEmail());
    }

    public AuthResponseDto adminLogin(LoginRequestDto dto) {
        AuthResponseDto authResponse = login(dto);
        Account account = accountDao.findByUsername(dto.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        boolean isAdmin = account.getRole().stream()
                .map(Role::getRoleName)
                .anyMatch(roleName -> "ADMIN".equals(roleName) || "ROLE_ADMIN".equals(roleName));

        if (!isAdmin) {
            throw new AccessDeniedException("Account does not have admin role");
        }
        return authResponse;
    }

    public AuthResponseDto refreshToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(refreshTokenStr);
        Account account = refreshToken.getAccount();

        UserDetails userDetails = userDetailsService.loadUserByUsername(account.getUsername());
        String newAccessToken = jwtService.generateAccessToken(userDetails);

        return new AuthResponseDto(newAccessToken, refreshToken.getToken(), account.getUsername(), account.getEmail());
    }

    public void logout(String refreshTokenStr) {
        refreshTokenService.revokeRefreshToken(refreshTokenStr);
    }

    private Role findRoleByName(String roleName) {
        return roleDao.findByRoleName(roleName)
                .or(() -> roleDao.findByRoleName("ROLE_" + roleName))
                .orElseThrow(() -> new EntityNotFoundException("Role not found: " + roleName));
    }
}