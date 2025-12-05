package com.newKisan.controller;

import com.newKisan.entity.User;
import com.newKisan.repository.UserRepository;
import com.newKisan.service.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordService passwordService;

    /**
     * Offline login: Verify credentials against local database
     * Request body: { "email": "user@example.com", "password": "password123" }
     * Response: { "uid": "uid123", "fullName": "John", "role": "farmer", ... }
     */
    @PostMapping("/login-offline")
    public User loginOffline(@RequestBody LoginRequest loginRequest) {
        try {
            logger.info("[AuthController] /login-offline called for email={}", loginRequest != null ? loginRequest.getEmail() : "<null>");
            String email = loginRequest.getEmail();
            String password = loginRequest.getPassword();

            if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
            }

            // Find user by email
            User user = userRepo.findByEmail(email);
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
            }

            // Verify password - add null check to prevent NullPointerException
            if (user.getPassword() == null || !passwordService.verifyPassword(password, user.getPassword())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
            }

            // Return user info (excluding password)
            user.setPassword(null);
            return user;
        } catch (ResponseStatusException e) {
            // Re-throw HTTP exceptions as-is
            throw e;
        } catch (Exception e) {
            // Log unexpected errors and return 500 with message
            System.err.println("[AuthController] Unexpected error during login: " + e.getMessage());
            e.printStackTrace();
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, 
                "Server error during login: " + (e.getMessage() != null ? e.getMessage() : "Unknown error")
            );
        }
    }

    // Lightweight ping endpoint for quick health/proxy checks
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}

class LoginRequest {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
