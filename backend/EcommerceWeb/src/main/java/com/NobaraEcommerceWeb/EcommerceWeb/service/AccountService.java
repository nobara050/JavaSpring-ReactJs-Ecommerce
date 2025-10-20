package com.NobaraEcommerceWeb.EcommerceWeb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;

@Service
public class AccountService {
    @Autowired 
    AccountDao accountDao;

    public ResponseEntity<Account> getAccountById(Long id) {
        Account account = accountDao.findById(id).orElse(null);
        if (account == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(account, HttpStatus.OK);
    }
}

