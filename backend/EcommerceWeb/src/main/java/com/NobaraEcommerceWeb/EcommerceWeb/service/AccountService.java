package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

