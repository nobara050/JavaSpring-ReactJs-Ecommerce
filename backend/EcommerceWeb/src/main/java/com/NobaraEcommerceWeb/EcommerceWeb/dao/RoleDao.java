package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Role;

@Repository
public interface RoleDao extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(String roleName);
}
