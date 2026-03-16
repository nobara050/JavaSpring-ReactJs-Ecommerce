package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AccountService {
    @Autowired 
    AccountDao accountDao;

    public List<Account> getAllAccounts() {
        List<Account> accounts = accountDao.findAll();
        if (accounts.isEmpty()) {
            throw new EntityNotFoundException("No accounts found");
        }
        return accounts;
    }

    public Account getAccountById(Long id) {
        Account account = accountDao.findById(id).orElse(null);
        if (account == null) {
            throw new EntityNotFoundException("Account not found with id: " + id);
        }
        return account;
    }

    public Account createAccount(Account account) {
        try {
            return accountDao.save(account);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create account", e);
        }
    }

    public Account updateAccount(Long id, Account account) {
        Account existingAccount = accountDao.findById(id).orElse(null);
        if (existingAccount == null) {
            throw new EntityNotFoundException("Account not found with id: " + id);
        }

        existingAccount.setUsername(account.getUsername());
        existingAccount.setPassword(account.getPassword());
        existingAccount.setEmail(account.getEmail());
        existingAccount.setFullName(account.getFullName());
        existingAccount.setPhone(account.getPhone());

        return accountDao.save(existingAccount);
    }

    public void deleteAccount(Long id) {
        throw new UnsupportedOperationException("Unimplemented method 'deleteAccount'");
    }
}

