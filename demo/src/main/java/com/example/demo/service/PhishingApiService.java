package com.example.demo.service;

import com.example.demo.dto.EmailRequest;
import com.example.demo.dto.PredictionResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PhishingApiService{

    private final RestTemplate restTemplate = new RestTemplate();

    public PredictionResponse analyzeEmail(String email){

        String url = "http://localhost:8000/predict";

        EmailRequest request = new EmailRequest(email);

        return restTemplate.postForObject(url, request, PredictionResponse.class);
    }
}