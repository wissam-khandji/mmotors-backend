package com.mmotors.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable() // Désactive CSRF pour Postman
            .authorizeHttpRequests()
            .anyRequest().permitAll(); // Autorise tout pour le moment
        return http.build();
    }
}