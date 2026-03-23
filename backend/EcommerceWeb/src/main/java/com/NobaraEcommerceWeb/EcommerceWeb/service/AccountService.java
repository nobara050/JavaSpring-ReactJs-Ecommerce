package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.AccountRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.AccountResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AccountService {

    @Autowired
    AccountDao accountDao;

    @Autowired
    ModelMapper modelMapper;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${app.base-url}")
    private String baseUrl;

    public List<AccountResponseDto> getAllAccounts() {
        return accountDao.findAll()
                .stream()
                .map(account -> modelMapper.map(account, AccountResponseDto.class))
                .collect(Collectors.toList());
    }

    public AccountResponseDto getAccountById(Long id) {
        Account account = accountDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + id));
        return modelMapper.map(account, AccountResponseDto.class);
    }

    public AccountResponseDto getAccountByUsername(String username) {
        Account account = accountDao.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with username: " + username));
        return modelMapper.map(account, AccountResponseDto.class);
    }

    // User tu cap nhat thong tin cua chinh minh (khong doi mat khau o day)
    public AccountResponseDto updateMe(String username, AccountRequestDto dto) {
        Account existing = accountDao.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with username: " + username));
        existing.setFullName(dto.getFullName());
        existing.setPhone(dto.getPhone());
        existing.setEmail(dto.getEmail());
        return modelMapper.map(accountDao.save(existing), AccountResponseDto.class);
    }

    // Upload avatar cho user
    public AccountResponseDto uploadAvatar(String username, MultipartFile file) {
        Account existing = accountDao.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with username: " + username));
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            String avatarUrl = baseUrl + "/uploads/" + fileName;
            existing.setAvatar(avatarUrl);
            return modelMapper.map(accountDao.save(existing), AccountResponseDto.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store avatar", e);
        }
    }

    public AccountResponseDto updateAccount(Long id, AccountRequestDto accountRequestDto) {
        Account existing = accountDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + id));
        existing.setUsername(accountRequestDto.getUsername());
        existing.setPassword(accountRequestDto.getPassword());
        existing.setEmail(accountRequestDto.getEmail());
        existing.setFullName(accountRequestDto.getFullName());
        existing.setPhone(accountRequestDto.getPhone());
        existing.setAvatar(accountRequestDto.getAvatar());
        Account saved = accountDao.save(existing);
        return modelMapper.map(saved, AccountResponseDto.class);
    }

    public void deleteAccount(Long id) {
        Account existing = accountDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + id));
        accountDao.delete(existing);
    }
}