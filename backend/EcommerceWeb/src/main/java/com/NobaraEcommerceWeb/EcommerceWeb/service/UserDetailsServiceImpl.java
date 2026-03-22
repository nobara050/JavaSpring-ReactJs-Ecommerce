package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Role;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    AccountDao accountDao;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountDao.findByUsernameWithRoles(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<Role> roles = account.getRole() != null ? account.getRole() : Collections.emptyList();
        String[] roleNames = roles.stream()
                .map(Role::getRoleName)
                .map(roleName -> {
                    if (roleName != null && roleName.startsWith("ROLE_")) {
                        return roleName.substring(5);
                    }
                    return roleName;
                })
                .filter(rn -> rn != null && !rn.isBlank())
                .toArray(String[]::new);

        return User.builder()
                .username(account.getUsername())
                .password(account.getPassword())
                .roles(roleNames)
                .build();
    }
}