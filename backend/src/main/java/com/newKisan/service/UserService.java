
package com.newKisan.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.newKisan.entity.Buyer;
import com.newKisan.entity.Farmer;
import com.newKisan.entity.User;
import com.newKisan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;


@Service
public class UserService {

    public User getUserByUid(String uid) {
        return userRepo.findByUid(uid);
    }

    public User getUserByEmail(String email) {
        if (email == null) return null;
        return userRepo.findByEmail(email.toLowerCase());
    }

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordService passwordService;

    @Autowired
    private FarmerService farmerService;

    @Autowired
    private BuyerService buyerService;

    // Generate numeric-only UIDs (10 digits) as requested
    private static final String ALPHANUM = "0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public User createUser(User user) {
        // Keep existing simple create behavior (used by other controllers)
        System.out.println("[UserService] createUser called with: " + user);

        // Ensure uid is present and valid (min 5-char, all uppercase)
        if (user.getUid() == null || user.getUid().length() < 5) {
            user.setUid(generateUid(10));
        } else {
            user.setUid(user.getUid().toUpperCase());
        }

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordService.hashPassword(user.getPassword()));
        }

        User saved = userRepo.save(user);
        System.out.println("[UserService] saved user: " + saved);
        return saved;
    }


    @Transactional
    public User createUserFromPayload(Map<String, Object> payload) {
        // Build User from incoming payload (flexible for firstName/lastName)
        User user = new User();

        // uid: if provided and valid (min 5-char, all uppercase), keep; otherwise generate
        String incomingUid = payload.get("uid") == null ? null : payload.get("uid").toString();
        if (incomingUid == null || incomingUid.length() < 5) {
            incomingUid = generateUid(10);
        } else {
            incomingUid = incomingUid.toUpperCase();
        }
        user.setUid(incomingUid);

        // Compose fullName from firstName/lastName when present, else try fullName
        String firstName = payload.get("firstName") == null ? null : payload.get("firstName").toString();
        String lastName = payload.get("lastName") == null ? null : payload.get("lastName").toString();
        if (firstName != null) {
            user.setFullName(firstName + (lastName != null ? " " + lastName : ""));
        } else if (payload.get("fullName") != null) {
            user.setFullName(payload.get("fullName").toString());
        }

        if (payload.get("email") != null) user.setEmail(payload.get("email").toString());
        if (payload.get("mobile") != null) user.setMobile(payload.get("mobile").toString());
        if (payload.get("state") != null) user.setState(payload.get("state").toString());
        if (payload.get("district") != null) user.setDistrict(payload.get("district").toString());
        if (payload.get("role") != null) user.setRole(payload.get("role").toString());

        if (payload.get("password") != null) {
            String raw = payload.get("password").toString();
            if (!raw.isEmpty()) user.setPassword(passwordService.hashPassword(raw));
        }

        // Save user first
        User saved = userRepo.save(user);
        System.out.println("[UserService] createUserFromPayload saved user: " + saved);

        // Also create farmer or buyer record using same uid
        String role = saved.getRole();
        if (role != null) {
            if (role.equalsIgnoreCase("farmer")) {
                Farmer farmer = new Farmer();
                farmer.setUid(saved.getUid());
                farmer.setFirstName(firstName != null ? firstName : "");
                farmer.setLastName(lastName != null ? lastName : "");
                farmer.setMobile(saved.getMobile());
                farmer.setState(saved.getState());
                farmer.setDistrict(saved.getDistrict());
                farmerService.addFarmer(farmer);
                System.out.println("[UserService] created farmer for uid: " + saved.getUid());
            } else if (role.equalsIgnoreCase("buyer")) {
                Buyer buyer = new Buyer();
                buyer.setUid(saved.getUid());
                buyer.setFirstName(firstName != null ? firstName : "");
                buyer.setLastName(lastName != null ? lastName : "");
                buyer.setMobile(saved.getMobile());
                buyer.setState(saved.getState());
                buyer.setDistrict(saved.getDistrict());
                buyerService.addBuyer(buyer);
                System.out.println("[UserService] created buyer for uid: " + saved.getUid());
            }
        }

        return saved;
    }

    private String generateUid(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHANUM.charAt(RANDOM.nextInt(ALPHANUM.length())));
        }
        return sb.toString();
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

    public User updateUserRole(String uid, String role) {
        User existing = userRepo.findByUid(uid);
        if (existing == null) return null;
        existing.setRole(role);
        User saved = userRepo.save(existing);

        // Create farmer/buyer record if role now present
        try {
            if (role != null) {
                if (role.equalsIgnoreCase("farmer")) {
                    Farmer farmer = new Farmer();
                    farmer.setUid(saved.getUid());
                    // best-effort fill
                    farmer.setFirstName(saved.getFullName() != null ? saved.getFullName() : "");
                    farmer.setLastName("");
                    farmer.setMobile(saved.getMobile());
                    farmer.setState(saved.getState());
                    farmer.setDistrict(saved.getDistrict());
                    try { farmerService.addFarmer(farmer); } catch (Exception e) { /* ignore */ }
                } else if (role.equalsIgnoreCase("buyer")) {
                    Buyer buyer = new Buyer();
                    buyer.setUid(saved.getUid());
                    buyer.setFirstName(saved.getFullName() != null ? saved.getFullName() : "");
                    buyer.setLastName("");
                    buyer.setMobile(saved.getMobile());
                    buyer.setState(saved.getState());
                    buyer.setDistrict(saved.getDistrict());
                    try { buyerService.addBuyer(buyer); } catch (Exception e) { /* ignore */ }
                }
            }
        } catch (Exception e) {
            System.err.println("Warning: could not create farmer/buyer after role update: " + e.getMessage());
        }

        return saved;
    }

    public void deleteAllNonAdminUsers() {
        userRepo.deleteAllNonAdminUsers();
        System.out.println("All non-admin users deleted successfully");
    }
}