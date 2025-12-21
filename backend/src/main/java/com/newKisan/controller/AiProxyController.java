package com.newKisan.controller;

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

    @PostMapping("/generate")
    public ResponseEntity<String> generate(@RequestBody Map<String, Object> body) {
        System.out.println("[AiProxy] Incoming request body: " + body);
        String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
        // Hardcoded API key for local development
        String apiKey = "AIzaSyBNJ68Z8Dq1zd2iIrPR97Tm_SBobwnngyw";
        if (apiKey == null || apiKey.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Server error: GEMINI_API_KEY not configured");
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
