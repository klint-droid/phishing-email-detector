package com.example.demo.service;

import com.example.demo.dto.EmailRequest;
import com.example.demo.dto.PredictionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PhishingApiService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.service.url:http://localhost:8000/predict}")
    private String aiServiceUrl;

    public PredictionResponse analyzeEmail(String email) {
        EmailRequest request = new EmailRequest(email);
        return restTemplate.postForObject(aiServiceUrl, request, PredictionResponse.class);
    }
}