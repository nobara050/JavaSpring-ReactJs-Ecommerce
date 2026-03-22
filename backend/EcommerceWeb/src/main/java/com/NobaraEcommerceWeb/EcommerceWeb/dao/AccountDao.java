package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;

@Repository
public interface AccountDao extends JpaRepository<Account, Long>{
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<Account> findByUsername(String username);          
    Optional<Account> findByEmail(String email);

    /** JOIN FETCH để JWT filter load role trong một query (tránh LazyInitializationException). */
    @Query("SELECT DISTINCT a FROM Account a LEFT JOIN FETCH a.role WHERE a.username = :username")
    Optional<Account> findByUsernameWithRoles(@Param("username") String username);
}


