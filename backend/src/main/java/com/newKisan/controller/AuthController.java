package com.newKisan.controller;

import com.newKisan.entity.User;
import com.newKisan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.newKisan.service.CropService cropService;

    @PostMapping("/login-offline")
    public ResponseEntity<?> loginOffline(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password"); // ignored if not present in DB

        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "email is required"));
        }

        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("uid", user.getUid());
        resp.put("role", user.getRole());
        resp.put("fullName", user.getFullName());
        resp.put("email", user.getEmail());

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/crops")
    public ResponseEntity<?> getCropsForAuth() {
        try {
            return ResponseEntity.ok(cropService.getAllCrops());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error fetching crops"));
        }
    }
}
