package com.newKisan.controller;

import com.newKisan.entity.User;
import com.newKisan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{uid}")
    public ResponseEntity<User> getUser(@PathVariable String uid) {
        User user = userService.getUserById(uid);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }


    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user){
        return ResponseEntity.ok(userService.saveUser(user));
    }
}
