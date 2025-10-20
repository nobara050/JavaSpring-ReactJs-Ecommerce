package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;

@Repository
public interface AccountDao extends JpaRepository<Account, Long>{
    Account findByUsername(String username);
    Account findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}


