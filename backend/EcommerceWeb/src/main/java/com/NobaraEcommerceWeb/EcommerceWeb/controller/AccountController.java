package com.NobaraEcommerceWeb.EcommerceWeb.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.NobaraEcommerceWeb.EcommerceWeb.dto.AccountRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.AccountResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.service.AccountService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/account")
public class AccountController {

    @Autowired
    AccountService accountService;

    @GetMapping("/me")
    public ResponseEntity<AccountResponseDto> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            return new ResponseEntity<>(accountService.getAccountByUsername(userDetails.getUsername()), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/me")
    public ResponseEntity<AccountResponseDto> updateMe(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AccountRequestDto dto) {
        try {
            return new ResponseEntity<>(accountService.updateMe(userDetails.getUsername(), dto), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<AccountResponseDto> uploadAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        try {
            return new ResponseEntity<>(accountService.uploadAvatar(userDetails.getUsername(), file), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<AccountResponseDto>> getAllAccounts() {
        try {
            return new ResponseEntity<>(accountService.getAllAccounts(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponseDto> getAccountById(@PathVariable Long id) {
        try {
            return new ResponseEntity<>(accountService.getAccountById(id), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountResponseDto> updateAccount(
            @PathVariable Long id,
            @RequestBody AccountRequestDto accountRequestDto) {
        try {
            return new ResponseEntity<>(accountService.updateAccount(id, accountRequestDto), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        try {
            accountService.deleteAccount(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}