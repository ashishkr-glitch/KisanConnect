package com.newKisan.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Hash a password using BCrypt
     */
    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    /**
     * Verify if a raw password matches a hashed password
     */
    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}
