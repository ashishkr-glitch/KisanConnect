package com.newKisan.config;

import com.newKisan.entity.User;
import com.newKisan.repository.UserRepository;
import com.newKisan.service.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds the database with test users on application startup.
 * This allows login testing without manual database setup.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordService passwordService;

    @Override
    public void run(String... args) throws Exception {
        // Check if test users already exist
        if (userRepository.findByEmail("farmer@test.com") != null) {
            System.out.println("[DataInitializer] Test users already exist. Skipping initialization.");
            return;
        }

        System.out.println("[DataInitializer] Initializing test users...");

        // Create test farmer
        User farmer = new User();
        farmer.setUid("FARM001");
        farmer.setEmail("farmer@test.com");
        farmer.setPassword(passwordService.hashPassword("farmer123"));
        farmer.setFullName("Test Farmer");
        farmer.setMobile("9999999991");
        farmer.setRole("farmer");
        farmer.setState("Maharashtra");
        farmer.setDistrict("Pune");
        userRepository.save(farmer);
        System.out.println("[DataInitializer] Created test farmer: farmer@test.com (password: farmer123)");

        // Create test buyer
        User buyer = new User();
        buyer.setUid("BUYER01");
        buyer.setEmail("buyer@test.com");
        buyer.setPassword(passwordService.hashPassword("buyer123"));
        buyer.setFullName("Test Buyer");
        buyer.setMobile("9999999992");
        buyer.setRole("buyer");
        buyer.setState("Karnataka");
        buyer.setDistrict("Bangalore");
        userRepository.save(buyer);
        System.out.println("[DataInitializer] Created test buyer: buyer@test.com (password: buyer123)");

        // Create test admin
        User admin = new User();
        admin.setUid("ADMIN01");
        admin.setEmail("admin@test.com");
        admin.setPassword(passwordService.hashPassword("admin123"));
        admin.setFullName("Test Admin");
        admin.setMobile("9999999993");
        admin.setRole("admin");
        admin.setState("Delhi");
        admin.setDistrict("Delhi");
        userRepository.save(admin);
        System.out.println("[DataInitializer] Created test admin: admin@test.com (password: admin123)");

        System.out.println("[DataInitializer] Test users initialized successfully!");
    }
}
