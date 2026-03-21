package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;

@Repository
public interface AccountDao extends JpaRepository<Account, Long>{
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<Account> findByUsername(String username);
    Optional<Account> findByEmail(String email);
}


