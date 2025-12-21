package com.newKisan.controller;

import com.newKisan.entity.User;
import com.newKisan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        List<User> list = userService.getAllUsers();
        if (list != null) {
            for (User u : list) {
                if (u != null) u.setPassword(null);
            }
        }
        return list;
    }

    @PostMapping
    public User createUser(@RequestBody java.util.Map<String, Object> payload) {
        // Create user and related farmer/buyer atomically on the backend
        return userService.createUserFromPayload(payload);
    }


    @GetMapping("/{uid}")
    public User getUserByUid(@PathVariable String uid) {
        User u = userService.getUserByUid(uid);
        if (u != null) u.setPassword(null);
        return u;
    }

    @GetMapping(path = "/by-email")
    public User getUserByEmail(@RequestParam String email) {
        User u = userService.getUserByEmail(email);
        if (u != null) u.setPassword(null);
        return u;
    }

    @DeleteMapping("/{uid}")
    public void deleteUser(@PathVariable String uid) {
        userService.deleteUser(uid);
    }

    @PutMapping("/{uid}/role")
    public User updateUserRole(@PathVariable String uid, @RequestBody java.util.Map<String, Object> payload) {
        String role = payload.get("role") == null ? null : payload.get("role").toString();
        return userService.updateUserRole(uid, role);
    }

    @PostMapping("/cleanup/delete-all-non-admin")
    public void deleteAllNonAdminUsers() {
        userService.deleteAllNonAdminUsers();
    }
}