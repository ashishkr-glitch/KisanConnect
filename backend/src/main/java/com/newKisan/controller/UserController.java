package com.newKisan.controller;

import com.newKisan.entity.User;
import com.newKisan.service.UserService;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{uid}")
    public User getUserById(@PathVariable String uid) {
        return userService.findById(uid);
    }

    @GetMapping("/by-email")
    public User getUserByEmail(@RequestParam String email) {
        return userService.findByEmail(email);
    }

    @PostMapping
    public User createUser(@RequestBody Map<String, Object> payload) {
        // Build User object from incoming payload (frontend sends firstName/lastName separately)
        User user = new User();
        // Generate uid if not provided
        String uid = payload.getOrDefault("uid", UUID.randomUUID().toString()).toString();
        user.setUid(uid);

        // Build full name
        String firstName = payload.getOrDefault("firstName", "").toString();
        String lastName = payload.getOrDefault("lastName", "").toString();
        String fullName = (firstName + " " + lastName).trim();
        user.setFullName(fullName.isEmpty() ? null : fullName);

        user.setEmail((String) payload.getOrDefault("email", null));
        user.setMobile((String) payload.getOrDefault("mobile", null));
        user.setDistrict((String) payload.getOrDefault("district", null));
        user.setState((String) payload.getOrDefault("state", null));
        user.setRole((String) payload.getOrDefault("role", null));

        // Persist and return created user
        return userService.createUser(user);
    }

    @DeleteMapping("/{uid}")
    public void deleteUser(@PathVariable String uid) {
        userService.deleteUser(uid);
    }
}