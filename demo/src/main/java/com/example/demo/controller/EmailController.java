package com.example.demo.controller;

import com.example.demo.dto.PredictionResponse;
import com.example.demo.service.PhishingApiService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class EmailController {

    private final PhishingApiService service;

    public EmailController(
            PhishingApiService service) {

        this.service = service;
    }

    @GetMapping("/")
    public String home() {

        return "index";
    }

    @PostMapping("/scan")
    public String scanEmail(
            @RequestParam String email,
            Model model) {

        PredictionResponse result =
                service.analyzeEmail(email);

        model.addAttribute(
                "result", result);

        return "result";
    }
}