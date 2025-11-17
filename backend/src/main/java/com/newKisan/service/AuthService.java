package com.newKisan.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

@Service
public class AuthService {

    private volatile boolean firebaseInitialized = false;

    private synchronized void tryInitFirebase() {
        if (firebaseInitialized) return;
        try {
            List<FirebaseApp> apps = FirebaseApp.getApps();
            if (apps != null && !apps.isEmpty()) {
                firebaseInitialized = true;
                return;
            }

            // Try to initialize using application default credentials / env var
            String credPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
            if (credPath != null && !credPath.isBlank()) {
                try (FileInputStream serviceAccount = new FileInputStream(credPath)) {
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .build();
                    FirebaseApp.initializeApp(options);
                    firebaseInitialized = true;
                }
            }
        } catch (IOException e) {
            // ignore initialization error; we'll fallback to non-Firebase mode
        }
    }

    /**
     * Verify an Authorization header and return the uid.
     * Supports either a real Firebase ID token (JWT) when Firebase Admin is configured,
     * or a simple developer-mode fallback where the client sends the raw uid as the token.
     */
    public String verifyAndGetUid(String authorizationHeader) {
        if (authorizationHeader == null) return null;
        String bearer = authorizationHeader.trim();
        if (bearer.toLowerCase().startsWith("bearer ")) {
            bearer = bearer.substring(7).trim();
        }
        if (bearer.isEmpty()) return null;

        // Heuristic: if token contains a '.' assume it's a JWT (Firebase ID token)
        if (bearer.contains(".")) {
            tryInitFirebase();
            if (!firebaseInitialized) {
                throw new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Server not configured to verify Firebase tokens");
            }

            try {
                FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(bearer);
                return decoded.getUid();
            } catch (FirebaseAuthException e) {
                throw new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid Firebase ID token");
            }
        }

        // Fallback developer mode: treat token value as uid directly
        return bearer;
    }
}
