package com.newKisan.repository;

import com.newKisan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
	// Find user by email (used by AuthController)
	User findByEmail(String email);
}
