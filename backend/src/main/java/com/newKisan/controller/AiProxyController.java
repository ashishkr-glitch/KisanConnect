package com.newKisan.controller;

import org.springframework.beans.factory.annotation.Value;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    @Value("${gemini.api.url:}")
    private String geminiApiUrlProp;

    @PostMapping("/generate")
    public ResponseEntity<String> generate(@RequestBody Map<String, Object> body) {
        System.out.println("[AiProxy] Incoming request body: " + body);
        // Determine the Gemini URL in this order:
        // 1. application property `gemini.api.url`
        // 2. environment variable `GEMINI_API_URL`
        // 3. fallback recommended model (flash-lite latest)
        String geminiUrl = geminiApiUrlProp;
        if (geminiUrl == null || geminiUrl.isEmpty()) {
            geminiUrl = System.getenv("GEMINI_API_URL");
        }
        if (geminiUrl == null || geminiUrl.isEmpty()) {
            geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent";
        }
        
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
            String respBody = ex.getResponseBodyAsString();
            System.err.println("[AiProxy] Provider returned status " + ex.getStatusCode() + ": " + respBody);

            // Try to parse retry delay from provider response and return friendly JSON
            try {
                ObjectMapper mapper = new ObjectMapper();
                Map<?,?> parsed = mapper.readValue(respBody, Map.class);
                Object errorObj = parsed.get("error");
                if (errorObj instanceof Map) {
                    Map<?,?> errorMap = (Map<?,?>) errorObj;
                    Object details = errorMap.get("details");
                    if (details instanceof Iterable) {
                        for (Object d : (Iterable<?>) details) {
                            if (d instanceof Map) {
                                Map<?,?> dm = (Map<?,?>) d;
                                Object retry = dm.get("retryDelay");
                                if (retry instanceof String) {
                                    String retryStr = (String) retry;
                                    // parse number of seconds (e.g. "43s")
                                    Integer seconds = null;
                                    try {
                                        String digits = retryStr.replaceAll("[^0-9]", "");
                                        if (!digits.isEmpty()) seconds = Integer.parseInt(digits);
                                    } catch (Exception e) { /* ignore parse errors */ }
                                    if (seconds != null) {
                                        HttpHeaders out = new HttpHeaders();
                                        out.set("Retry-After", seconds.toString());
                                        String bodyOut = String.format("{\"error\":\"quota_exceeded\",\"retryAfterSeconds\":%d}", seconds);
                                        return new ResponseEntity<>(bodyOut, out, ex.getStatusCode());
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (Exception parseEx) {
                // ignore parsing errors and fall through to returning original response
            }

            return ResponseEntity.status(ex.getStatusCode()).body(respBody);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }
}
