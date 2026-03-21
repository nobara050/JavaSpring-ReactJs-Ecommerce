package com.NobaraEcommerceWeb.EcommerceWeb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    AccountDao accountDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountDao.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return User.builder()
                .username(account.getUsername())
                .password(account.getPassword())
                .roles(account.getRole().stream()
                        .map(role -> {
                            String roleName = role.getRoleName();
                            if (roleName != null && roleName.startsWith("ROLE_")) {
                                return roleName.substring(5);
                            }
                            return roleName;
                        })
                        .toArray(String[]::new))
                .build();
    }
}