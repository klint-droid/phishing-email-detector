export interface PredictionResult {
  prediction: "PHISHING" | "SAFE";
  confidence: number;
  risk_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reasons: string[];
  suspicious_urls: string[];
  latency_ms?: number;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  snippet: string;
  fullText: string;
  result: PredictionResult;
}
