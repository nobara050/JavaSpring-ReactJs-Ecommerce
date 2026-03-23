package com.NobaraEcommerceWeb.EcommerceWeb.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.NobaraEcommerceWeb.EcommerceWeb.filter.JwtAuthFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring().requestMatchers("/uploads/**");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider)
            throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                var config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowedOrigins(java.util.List.of(allowedOrigins));
                config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                config.setAllowedHeaders(java.util.List.of("*"));
                return config;
            }))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // Product
                .requestMatchers(HttpMethod.GET, "/product/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/product/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/product/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/product/**").hasRole("ADMIN")

                // Category
                .requestMatchers(HttpMethod.GET, "/category/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/category/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/category/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/category/**").hasRole("ADMIN")

                // Discount
                .requestMatchers(HttpMethod.GET, "/discount/**").permitAll()
                .requestMatchers("/discount/**").hasRole("ADMIN")

                // Review
                .requestMatchers(HttpMethod.GET, "/review/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/review/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/review/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/review/**").authenticated()

                // Account
                .requestMatchers(HttpMethod.GET, "/account/me").authenticated()
                .requestMatchers(HttpMethod.PUT, "/account/me").authenticated()
                .requestMatchers(HttpMethod.POST, "/account/me/avatar").authenticated()
                .requestMatchers(HttpMethod.GET, "/account/*/addresses").authenticated()
                .requestMatchers(HttpMethod.GET, "/account/addresses/*").authenticated()
                .requestMatchers(HttpMethod.POST, "/account/*/addresses").authenticated()
                .requestMatchers(HttpMethod.PUT, "/account/addresses/*").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/account/addresses/*").authenticated()
                .requestMatchers("/account/**").hasRole("ADMIN")

                // Role
                .requestMatchers("/role/**").hasRole("ADMIN")

                // Cart
                .requestMatchers("/cart/**").authenticated()

                // Order
                .requestMatchers(HttpMethod.POST, "/order").authenticated()
                .requestMatchers(HttpMethod.GET, "/order/account/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/order/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/order/*/status").hasRole("ADMIN")

                // Coupon
                .requestMatchers(HttpMethod.GET, "/coupon/code/**").authenticated()
                .requestMatchers("/coupon/**").hasRole("ADMIN")

                // Payment
                .requestMatchers("/payment/**").authenticated()

                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}