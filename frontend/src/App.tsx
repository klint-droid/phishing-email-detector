import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Zap,
  Link2,
  Terminal,
  History,
  Trash2,
  Settings2,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Server
} from 'lucide-react';
import type { PredictionResult, ScanHistoryItem } from './types';
import './App.css';

const DEFAULT_ENDPOINT = 'http://127.0.0.1:8001/predict';

const PRESETS = [
  {
    name: 'Phishing (Urgent Lock)',
    type: 'phishing',
    text: 'URGENT! Your account has been temporarily locked due to suspicious login attempts. Please click the link below to verify your password immediately to avoid permanent suspension: http://secure-verify-account.tk/login'
  },
  {
    name: 'Phishing (Payroll Scam)',
    type: 'phishing',
    text: 'Action Required: Your direct deposit payroll information could not be processed for the upcoming cycle. Update your banking credentials now at http://paycheck-portal-auth.com/verify to prevent salary delays.'
  },
  {
    name: 'Safe (Team Retrospective)',
    type: 'safe',
    text: "Hi team, please find attached the meeting minutes and presentation slides from today's quarterly sprint retrospective. Let me know if you have any questions before our Friday standup."
  },
  {
    name: 'Safe (HR Policy Notice)',
    type: 'safe',
    text: 'Dear employees, this is a reminder that the annual benefits open enrollment period begins next Monday. You can review plan options in the internal Workday portal.'
  }
];

export const App: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [endpoint, setEndpoint] = useState<string>(() => {
    return localStorage.getItem('phishguard_endpoint') || DEFAULT_ENDPOINT;
  });
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [endpointStatus, setEndpointStatus] = useState<'idle' | 'checking' | 'online' | 'offline'>('idle');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('phishguard_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('phishguard_endpoint', endpoint);
  }, [endpoint]);

  useEffect(() => {
    localStorage.setItem('phishguard_history', JSON.stringify(history));
  }, [history]);

  // Test the current API target
  const checkEndpointHealth = async () => {
    setEndpointStatus('checking');
    try {
      // Determine root url
      const rootUrl = endpoint.replace(/\/predict\/?$/, '') || endpoint;
      const res = await fetch(rootUrl, { method: 'GET' });
      if (res.ok) {
        setEndpointStatus('online');
      } else {
        setEndpointStatus('offline');
      }
    } catch {
      setEndpointStatus('offline');
    }
  };

  const handleScan = async (overrideText?: string) => {
    const textToScan = (overrideText ?? email).trim();
    if (!textToScan) {
      setError('Please paste or type an email text to scan.');
      return;
    }

    setError(null);
    setLoading(true);
    const startTime = performance.now();

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: textToScan }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }

      const data: PredictionResult = await response.json();
      const latency = Math.round(performance.now() - startTime);
      data.latency_ms = latency;

      setResult(data);
      setEndpointStatus('online');

      // Add to scan history
      const historyItem: ScanHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        snippet: textToScan.slice(0, 75) + (textToScan.length > 75 ? '...' : ''),
        fullText: textToScan,
        result: data,
      };

      setHistory(prev => [historyItem, ...prev.slice(0, 9)]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown network failure';
      setError(`${msg}. Verify your FastAPI or AWS Lambda Function URL is active and reachable.`);
      setEndpointStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetText: string) => {
    setEmail(presetText);
    setError(null);
  };

  const loadHistoryItem = (item: ScanHistoryItem) => {
    setEmail(item.fullText);
    setResult(item.result);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('phishguard_history');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleScan();
    }
  };

  const isPhishing = result?.prediction === 'PHISHING';

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-icon-box">
            <Shield size={28} />
          </div>
          <div className="brand-titles">
            <h1>PhishGuard AI</h1>
            <p>Real-time Phishing Detection • 82K Kaggle ML Dataset</p>
          </div>
        </div>

        <div className="header-controls">
          <button
            type="button"
            id="endpointToggleBtn"
            className="endpoint-toggle-btn"
            onClick={() => setShowConfig(!showConfig)}
          >
            <span className={`status-dot ${endpointStatus}`} />
            <Server size={14} />
            <span>Target API</span>
            <Settings2 size={13} style={{ opacity: 0.6 }} />
          </button>
        </div>
      </header>

      {/* Target Config Drawer */}
      {showConfig && (
        <div className="endpoint-config-card" id="endpointConfigCard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              API ENDPOINT CONFIGURATION
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Toggle between Localhost & AWS Lambda Function URL
            </span>
          </div>
          <div className="endpoint-input-row">
            <input
              type="text"
              id="endpointUrlInput"
              value={endpoint}
              onChange={e => setEndpoint(e.target.value)}
              placeholder="e.g. https://xyz.lambda-url.region.on.aws/predict"
            />
            <button
              type="button"
              id="testPingBtn"
              className="test-ping-btn"
              onClick={checkEndpointHealth}
            >
              Test Ping
            </button>
          </div>
        </div>
      )}

      <main className="dashboard-grid">
        {/* Email Input Panel */}
        <section className="scanner-card" id="scannerCard">
          <div className="scanner-header">
            <div className="section-label">
              <Terminal size={17} color="var(--cyan-primary)" />
              <span>Email Content Inspector</span>
            </div>

            <div className="preset-pills">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  id={`presetBtn-${idx}`}
                  className={`preset-btn ${p.type === 'phishing' ? 'phish-preset' : 'safe-preset'}`}
                  onClick={() => applyPreset(p.text)}
                >
                  <Sparkles size={11} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="textarea-wrapper">
            <textarea
              id="emailTextarea"
              className="email-textarea"
              placeholder="Paste raw email body, suspicious URL links, or urgent account notification here... (Ctrl + Enter to scan)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="textarea-footer">
              <span>{email.length} characters</span>
              <span>Tip: Press Ctrl + Enter to scan</span>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'var(--rose-bg)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fda4af',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="scanner-actions">
            <button
              type="button"
              id="clearBtn"
              className="clear-btn"
              onClick={() => { setEmail(''); setResult(null); setError(null); }}
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>

            <button
              type="button"
              id="analyzeThreatBtn"
              className="scan-submit-btn"
              onClick={() => handleScan()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Zap size={16} className="spinner-icon" />
                  <span>Analyzing Threat Vector...</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Analyze Email</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </section>

        {/* Results Panel */}
        {result && (
          <section className="results-card" id="resultsCard">
            {/* Verdict Hero Banner */}
            <div className={`verdict-hero ${isPhishing ? 'phishing' : 'safe'}`}>
              <div className="verdict-badge">
                <div className="verdict-icon-bubble">
                  {isPhishing ? <ShieldAlert size={32} /> : <ShieldCheck size={32} />}
                </div>
                <div className="verdict-details">
                  <h2>{isPhishing ? 'PHISHING THREAT DETECTED' : 'LEGITIMATE & SAFE EMAIL'}</h2>
                  <p>
                    {isPhishing
                      ? 'High probability of social engineering, credential harvesting, or deceptive links.'
                      : 'Linguistic patterns match standard authentic communication.'}
                  </p>
                </div>
              </div>

              <div className={`risk-level-tag ${isPhishing ? 'phishing' : 'safe'}`}>
                {result.risk_level} RISK
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-title">
                  <Zap size={13} />
                  <span>Model Confidence</span>
                </div>
                <div className="metric-big-val">{result.confidence}%</div>
                <div className="progress-track">
                  <div
                    className={`progress-bar ${isPhishing ? 'phishing' : 'safe'}`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-title">
                  <AlertTriangle size={13} />
                  <span>Threat Risk Score</span>
                </div>
                <div className="metric-big-val">{result.risk_score} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>/ 100</span></div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  Heuristic & keyword sensitivity
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-title">
                  <Clock size={13} />
                  <span>Inference Latency</span>
                </div>
                <div className="metric-big-val">{result.latency_ms ?? 18} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>ms</span></div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  End-to-end response time
                </div>
              </div>
            </div>

            {/* Reasons / Keywords Section */}
            <div className="detail-section">
              <div className="detail-section-title">
                <CheckCircle2 size={14} color="var(--cyan-primary)" />
                <span>Detection Signals & Heuristics</span>
              </div>
              <div className="chips-list">
                {result.reasons && result.reasons.length > 0 ? (
                  result.reasons.map((r, i) => (
                    <span key={i} className="chip threat">
                      <AlertTriangle size={12} />
                      {r}
                    </span>
                  ))
                ) : (
                  <span className="chip clean">
                    <CheckCircle2 size={12} />
                    No malicious trigger terms flagged
                  </span>
                )}
              </div>
            </div>

            {/* Suspicious URLs Section */}
            {result.suspicious_urls && result.suspicious_urls.length > 0 && (
              <div className="detail-section">
                <div className="detail-section-title">
                  <Link2 size={14} color="var(--rose-danger)" />
                  <span>Flagged Suspicious Hyperlinks ({result.suspicious_urls.length})</span>
                </div>
                <div className="urls-box">
                  {result.suspicious_urls.map((u, i) => (
                    <div key={i} className="url-row">
                      <Link2 size={13} style={{ flexShrink: 0 }} />
                      <span>{u}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Scan History */}
        {history.length > 0 && (
          <section className="history-card" id="historyCard">
            <div className="history-header">
              <div className="section-label">
                <History size={16} color="var(--cyan-primary)" />
                <span>Recent Scan Audit Log ({history.length})</span>
              </div>
              <button
                type="button"
                id="clearHistoryBtn"
                className="clear-btn"
                onClick={clearHistory}
              >
                Clear History
              </button>
            </div>

            <div className="history-items-list">
              {history.map(item => {
                const itemIsPhishing = item.result.prediction === 'PHISHING';
                return (
                  <div
                    key={item.id}
                    className="history-item"
                    onClick={() => loadHistoryItem(item)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                        {item.timestamp}
                      </span>
                      <span className="history-snippet">{item.snippet}</span>
                    </div>

                    <span className={`history-badge ${itemIsPhishing ? 'phishing' : 'safe'}`}>
                      {item.result.prediction} ({item.result.confidence}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-badges">
          <span className="footer-badge">React 19 + TypeScript</span>
          <span className="footer-badge">Vite Engine</span>
          <span className="footer-badge">Random Forest • 98.6% Accuracy</span>
          <span className="footer-badge">82,486 Trained Emails</span>
          <span className="footer-badge">AWS Lambda Serverless Ready</span>
        </div>
        <p>Built for real-time cybersecurity email classification.</p>
      </footer>
    </div>
  );
};

export default App;
