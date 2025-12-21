
package com.newKisan.repository;

import com.newKisan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
        User findByUid(String uid);
    User findByEmail(String email);

    @Modifying
    @Transactional
    @Query("DELETE FROM User u WHERE u.role != 'admin'")
    void deleteAllNonAdminUsers();
}
