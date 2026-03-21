package com.NobaraEcommerceWeb.EcommerceWeb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NobaraEcommerceWeb.EcommerceWeb.dto.AuthResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.LoginRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.RegisterRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.service.AuthService;

import java.util.Map;

import org.springframework.security.access.AccessDeniedException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody RegisterRequestDto dto) {
        try {
            return new ResponseEntity<>(authService.register(dto), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto dto) {
        try {
            return new ResponseEntity<>(authService.login(dto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponseDto> adminLogin(@RequestBody LoginRequestDto dto) {
        try {
            return new ResponseEntity<>(authService.adminLogin(dto), HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refresh(@RequestBody Map<String, String> body) {
        try {
            String refreshToken = body.get("refreshToken");
            return new ResponseEntity<>(authService.refreshToken(refreshToken), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Map<String, String> body) {
        try {
            String refreshToken = body.get("refreshToken");
            authService.logout(refreshToken);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}