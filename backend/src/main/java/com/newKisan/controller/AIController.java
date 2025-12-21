package com.newKisan.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*")
public class AIController {

	@Value("${GEMINI_API_URL:}")
	private String geminiApiUrl;

	@Value("${GEMINI_API_KEY:}")
	private String geminiApiKey;

	private final RestTemplate rest = new RestTemplate();

	@RequestMapping(value = "/generate", method = RequestMethod.POST)
	public ResponseEntity<?> generate(@RequestBody Map<String, Object> body) {
		if (geminiApiUrl == null || geminiApiUrl.isBlank()) {
			Map<String, String> err = new HashMap<>();
			err.put("error", "AI backend not configured");
			err.put("message", "Set GEMINI_API_URL (and GEMINI_API_KEY if required) in the backend environment");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
		}

		try {
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			if (geminiApiKey != null && !geminiApiKey.isBlank()) {
				// For Google Generative Language API (gemini), the API key is sent using
				// the `X-goog-api-key` header (or as ?key=...); for other providers use Bearer token.
				String urlLower = geminiApiUrl.toLowerCase();
				if (urlLower.contains("generativelanguage.googleapis.com") || urlLower.contains("googleapis.com")) {
					headers.set("X-goog-api-key", geminiApiKey);
				} else {
					headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + geminiApiKey);
				}
			}

			org.springframework.http.HttpEntity<Map<String, Object>> request =
					new org.springframework.http.HttpEntity<>(body, headers);

			ResponseEntity<String> resp = rest.exchange(geminiApiUrl, HttpMethod.POST, request, String.class);

			HttpHeaders out = new HttpHeaders();
			out.setContentType(MediaType.APPLICATION_JSON);
			return new ResponseEntity<>(resp.getBody(), out, resp.getStatusCode());

		} catch (RestClientException e) {
			Map<String, String> err = new HashMap<>();
			err.put("error", "AI proxy error");
			err.put("message", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(err);
		}
	}

	@RequestMapping(value = "/generate", method = RequestMethod.OPTIONS)
	public ResponseEntity<?> options() {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Access-Control-Allow-Origin", "*");
		headers.add("Access-Control-Allow-Methods", "POST,OPTIONS");
		headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization");
		return new ResponseEntity<>(headers, HttpStatus.OK);
	}
}
