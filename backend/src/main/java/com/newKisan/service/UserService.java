package com.newKisan.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.newKisan.entity.User;
import com.newKisan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public User createUser(User user) {
        return userRepo.save(user);
    }

    public void deleteUser(String uid) {
        // Delete from local database
        userRepo.deleteById(uid);
        
        // Delete from Firebase Authentication (optional, best effort)
        try {
            // Only attempt Firebase deletion if SDK is properly initialized
            com.google.firebase.auth.FirebaseAuth auth = FirebaseAuth.getInstance();
            if (auth != null) {
                auth.deleteUser(uid);
            }
        } catch (IllegalStateException e) {
            // Firebase SDK not initialized - this is fine for development
            System.err.println("Firebase SDK not initialized - user deleted from local database only");
        } catch (FirebaseAuthException e) {
            // Log the error but don't fail the entire deletion
            System.err.println("Warning: Could not delete user from Firebase: " + e.getMessage());
        } catch (Exception e) {
            // Catch any other exceptions
            System.err.println("Warning: Error during Firebase deletion: " + e.getMessage());
        }
    }
}