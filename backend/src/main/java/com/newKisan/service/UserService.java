
package com.newKisan.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.newKisan.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @PersistenceContext
    private EntityManager em;

    public List<User> getAllUsers() {
        TypedQuery<User> q = em.createQuery("select u from User u", User.class);
        return q.getResultList();
    }

    @Transactional
    public User createUser(User user) {
        em.persist(user);
        return user;
    }

    public void deleteUser(String uid) {
        User u = em.find(User.class, uid);
        if (u != null) {
            em.remove(u);
        }

        try {
            FirebaseAuth auth = FirebaseAuth.getInstance();
            if (auth != null) {
                auth.deleteUser(uid);
            }
        } catch (IllegalStateException e) {
            System.err.println("Firebase SDK not initialized - user deleted from local database only");
        } catch (FirebaseAuthException e) {
            System.err.println("Warning: Could not delete user from Firebase: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Warning: Error during Firebase deletion: " + e.getMessage());
        }
    }

    public User findByEmail(String email) {
        if (email == null) return null;
        TypedQuery<User> q = em.createQuery("select u from User u where u.email = :email", User.class);
        q.setParameter("email", email);
        try {
            return q.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public User findById(String uid) {
        if (uid == null) return null;
        return em.find(User.class, uid);
    }
}