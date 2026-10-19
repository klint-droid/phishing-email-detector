package com.example.demo.dto;

import java.util.List;

public class PredictionResponse {

    private String prediction;
    private Double confidence;
    private Integer risk_score;
    private String risk_level;

    private List<String> reasons;

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public Integer getRisk_score() {
        return risk_score;
    }

    public void setRisk_score(Integer risk_score) {
        this.risk_score = risk_score;
    }

    public String getRisk_level() {
        return risk_level;
    }

    public void setRisk_level(String risk_level) {
        this.risk_level = risk_level;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }
}