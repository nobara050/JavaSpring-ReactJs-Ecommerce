package com.NobaraEcommerceWeb.EcommerceWeb.config;

import java.util.List;
import java.util.Set;
import java.util.LinkedHashSet;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.RoleDao;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Role;

@Component
public class AuthDataInitializer implements CommandLineRunner {

    private final RoleDao roleDao;
    private final AccountDao accountDao;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    @Value("${app.admin.email:admin@ecommerce.local}")
    private String adminEmail;

    @Value("${app.admin.full-name:System Admin}")
    private String adminFullName;

    @Value("${app.admin.phone:0000000000}")
    private String adminPhone;

    public AuthDataInitializer(RoleDao roleDao, AccountDao accountDao, PasswordEncoder passwordEncoder) {
        this.roleDao = roleDao;
        this.accountDao = accountDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Role userRole = ensureRole("USER", "Default user role");
        Role adminRole = ensureRole("ADMIN", "Administrator role");
        ensureAdminAccount(adminRole, userRole);
    }

    private Role ensureRole(String roleName, String description) {
        return roleDao.findByRoleName(roleName)
                .or(() -> roleDao.findByRoleName("ROLE_" + roleName))
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setRoleName(roleName);
                    role.setDescription(description);
                    return roleDao.save(role);
                });
    }

    private void ensureAdminAccount(Role adminRole, Role userRole) {
        Account admin = accountDao.findByUsername(adminUsername).orElseGet(Account::new);
        admin.setUsername(adminUsername);

        // Keep configured password as source of truth for default admin account.
        if (admin.getPassword() == null || !passwordEncoder.matches(adminPassword, admin.getPassword())) {
            admin.setPassword(passwordEncoder.encode(adminPassword));
        }

        admin.setEmail(adminEmail);
        admin.setFullName(adminFullName);
        admin.setPhone(adminPhone);
        admin.setIsActive(true);

        Set<Role> roleSet = new LinkedHashSet<>();
        if (admin.getRole() != null) {
            roleSet.addAll(admin.getRole());
        }
        roleSet.add(adminRole);
        roleSet.add(userRole);
        admin.setRole(List.copyOf(roleSet));

        accountDao.save(admin);
    }
}
