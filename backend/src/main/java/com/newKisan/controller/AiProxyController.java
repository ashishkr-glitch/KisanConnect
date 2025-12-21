package com.newKisan.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AiProxyController {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @PostMapping("/generate")
    public ResponseEntity<String> generate(@RequestBody Map<String, Object> body) {
        System.out.println("[AiProxy] Incoming request body: " + body);
        String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
        
        // Get API key from environment variable (GEMINI_API_KEY or application.properties: gemini.api.key)
        String apiKey = geminiApiKey;
        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = System.getenv("GEMINI_API_KEY");
        }
        
        if (apiKey == null || apiKey.isEmpty()) {
            System.err.println("[AiProxy] ERROR: GEMINI_API_KEY not configured!");
            System.err.println("[AiProxy] Please set GEMINI_API_KEY environment variable or gemini.api.key in application.properties");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"Server error: GEMINI_API_KEY not configured. Set GEMINI_API_KEY environment variable or add 'gemini.api.key' to application.properties\"}");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        // If the API key looks like a Google API key (starts with "AIza"), send it using
        // the X-goog-api-key header. Otherwise, send as Bearer token.
        if (apiKey.startsWith("AIza")) {
            headers.set("X-goog-api-key", apiKey);
            System.out.println("[AiProxy] Using X-goog-api-key header for API key.");
        } else {
            headers.setBearerAuth(apiKey);
            System.out.println("[AiProxy] Using Authorization: Bearer <token> for API key.");
        }

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<String> resp = restTemplate.postForEntity(geminiUrl, request, String.class);
            return ResponseEntity.status(resp.getStatusCode()).body(resp.getBody());
        } catch (HttpStatusCodeException ex) {
            System.err.println("[AiProxy] Provider returned status " + ex.getStatusCode() + ": " + ex.getResponseBodyAsString());
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getResponseBodyAsString());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }
}
