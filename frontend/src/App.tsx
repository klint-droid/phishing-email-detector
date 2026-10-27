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
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  FileText,
  ChevronDown,
  Layers
} from 'lucide-react';
import type { PredictionResult, ScanHistoryItem } from './types';
import './App.css';

const API_ENDPOINT = (() => {
  const envUrl = import.meta.env.VITE_API_URL || 'https://j36ftulutz3iubmjcnsvxtfb240hwxka.lambda-url.ap-southeast-2.on.aws/predict';
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  const root = trimmed.replace(/\/predict$/, '') || trimmed;
  return `${root}/predict`;
})();

const SAMPLE_PHISHING = "Subject: Action Required: Your payroll direct deposit could not be verified.\n\nDear employee,\n\nOur automated accounting system detected an invalid routing profile for your upcoming compensation disbursement. To avoid wage payment disruption on the upcoming cycle, please log in immediately to confirm your institutional credentials:\n\nhttp://payroll-portal-verification.example.com/login?auth=8923\n\nIf you have updated your profile within the last 24 hours, you may safely ignore this message.\n\nCorporate Payroll Services";

const SAMPLE_SAFE = "Hi team,\n\nPlease find attached the agenda and slide deck for tomorrow's quarterly product planning session. We will be reviewing user research findings and finalizing sprint milestones.\n\nLet me know if there are additional topics you would like to include before 4 PM today.\n\nBest regards,\nSarah Jenkins\nProduct Operations";

export const App: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('phishguard_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('phishguard_history', JSON.stringify(history));
  }, [history]);

  const scrollToScanner = () => {
    const el = document.getElementById('scanner-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
      const response = await fetch(API_ENDPOINT, {
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

      const historyItem: ScanHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        snippet: textToScan.slice(0, 75) + (textToScan.length > 75 ? '...' : ''),
        fullText: textToScan,
        result: data,
      };

      setHistory(prev => [historyItem, ...prev.slice(0, 9)]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network request failed';
      setError(`${msg}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = (item: ScanHistoryItem) => {
    setEmail(item.fullText);
    setResult(item.result);
    setError(null);
    scrollToScanner();
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

  const toggleFaq = (index: number) => {
    setActiveFaq(prev => prev === index ? null : index);
  };

  const isPhishing = result?.prediction === 'PHISHING';

  return (
    <div className="landing-root">
      {/* Navigation */}
      <nav className="top-nav">
        <div className="nav-container">
          <a href="#" className="nav-brand">
            <div className="nav-logo">
              <Shield size={20} />
            </div>
            <span className="nav-title">PhishGuard AI</span>
          </a>

          <div className="nav-links">
            <a href="#how-it-works">How It Works</a>
            <a href="#dataset">Model & Dataset</a>
            <a href="#faq">FAQ</a>
            <button type="button" className="nav-cta" onClick={scrollToScanner}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-container">
          <div className="hero-pill">
            <span className="status-indicator"></span>
            <span>Trained on 82,486 Verified Benchmark Emails</span>
          </div>

          <h1 className="hero-heading">
            Detect Phishing Emails in Seconds with <span className="gradient-text">Machine Learning</span>
          </h1>

          <p className="hero-description">
            PhishGuard AI analyzes conversational tone, urgency cues, and hidden deceptive links 
            in real time. Built with an ensemble Random Forest classifier delivering 98.64% test accuracy.
          </p>

          <div className="hero-buttons">
            <button type="button" className="btn-primary" onClick={scrollToScanner}>
              <span>Get Started</span>
              <ArrowRight size={16} />
            </button>
            <a href="#how-it-works" className="btn-secondary">
              <span>View Methodology</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hero-metrics">
            <div className="metric-item">
              <div className="metric-number">98.64%</div>
              <div className="metric-label">Verified Test Accuracy</div>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <div className="metric-number">82,486</div>
              <div className="metric-label">Emails in Dataset</div>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <div className="metric-number">&lt; 50 ms</div>
              <div className="metric-label">Inference Latency</div>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <div className="metric-number">100%</div>
              <div className="metric-label">Stateless & Private</div>
            </div>
          </div>
        </div>
      </header>

      {/* Live Interactive Scanner Section */}
      <section id="scanner-section" className="scanner-container">
        <div className="section-header">
          <div className="section-pill">Interactive Tool</div>
          <h2>Analyze an Email</h2>
          <p>Paste any suspicious or regular email below to run a real-time threat scan.</p>
        </div>

        <div className="scanner-card">
          <div className="scanner-topbar">
            <div className="scanner-title">
              <Terminal size={17} color="var(--cyan-primary)" />
              <span>Email Content Inspector</span>
            </div>

            <div className="sample-buttons">
              <span className="sample-label">Load sample:</span>
              <button
                type="button"
                className="sample-btn phish"
                onClick={() => { setEmail(SAMPLE_PHISHING); setError(null); }}
              >
                Phishing Example
              </button>
              <button
                type="button"
                className="sample-btn safe"
                onClick={() => { setEmail(SAMPLE_SAFE); setError(null); }}
              >
                Legitimate Example
              </button>
            </div>
          </div>

          <div className="textarea-wrapper">
            <textarea
              id="emailTextarea"
              className="email-textarea"
              placeholder="Paste raw email body, subject line, or notification text here... (Ctrl + Enter to scan)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="textarea-footer">
              <span>{email.length} characters</span>
              <span>Shortcut: Ctrl + Enter</span>
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="scanner-actions">
            <button
              type="button"
              className="clear-btn"
              onClick={() => { setEmail(''); setResult(null); setError(null); }}
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>

            <button
              type="button"
              className="scan-submit-btn"
              onClick={() => handleScan()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Zap size={16} className="spinner-icon" />
                  <span>Scanning Threat Vector...</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Scan Email Now</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scan Results Panel */}
        {result && (
          <div className="results-card">
            <div className={`verdict-hero ${isPhishing ? 'phishing' : 'safe'}`}>
              <div className="verdict-badge">
                <div className="verdict-icon-bubble">
                  {isPhishing ? <ShieldAlert size={32} /> : <ShieldCheck size={32} />}
                </div>
                <div className="verdict-details">
                  <h3>{isPhishing ? 'PHISHING THREAT DETECTED' : 'LEGITIMATE & SAFE EMAIL'}</h3>
                  <p>
                    {isPhishing
                      ? 'Elevated probability of social engineering, credential harvesting, or deceptive links.'
                      : 'Language structure matches standard authentic personal or business communication.'}
                  </p>
                </div>
              </div>

              <div className={`risk-level-tag ${isPhishing ? 'phishing' : 'safe'}`}>
                {result.risk_level} RISK
              </div>
            </div>

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
                <div className="metric-big-val">
                  {result.risk_score} <span className="metric-sub">/ 100</span>
                </div>
                <p className="metric-caption">Heuristic keyword weight</p>
              </div>

              <div className="metric-card">
                <div className="metric-title">
                  <Clock size={13} />
                  <span>Response Time</span>
                </div>
                <div className="metric-big-val">
                  {result.latency_ms ?? 24} <span className="metric-sub">ms</span>
                </div>
                <p className="metric-caption">Live AWS Lambda latency</p>
              </div>
            </div>

            {/* Signals Section */}
            <div className="detail-section">
              <div className="detail-section-title">
                <CheckCircle2 size={14} color="var(--cyan-primary)" />
                <span>Detection Signals</span>
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
                  <span>Flagged URLs ({result.suspicious_urls.length})</span>
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
          </div>
        )}

        {/* Scan Audit Log */}
        {history.length > 0 && (
          <div className="history-card">
            <div className="history-header">
              <div className="section-label">
                <History size={16} color="var(--cyan-primary)" />
                <span>Recent Scan Audit Log ({history.length})</span>
              </div>
              <button
                type="button"
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
                    <div className="history-left">
                      <span className="history-time">{item.timestamp}</span>
                      <span className="history-snippet">{item.snippet}</span>
                    </div>

                    <span className={`history-badge ${itemIsPhishing ? 'phishing' : 'safe'}`}>
                      {item.result.prediction} ({item.result.confidence}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="features-section">
        <div className="section-header">
          <div className="section-pill">Architecture</div>
          <h2>How PhishGuard AI Works</h2>
          <p>A multi-stage classification pipeline combining statistical NLP and machine learning.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FileText size={22} />
            </div>
            <h3>1. Parsing & Normalization</h3>
            <p>
              The raw email body is parsed to strip noise, standardize whitespace, and isolate embedded hyperlinks. Special tokens preserve structural signals like domain formats and email references.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Layers size={22} />
            </div>
            <h3>2. TF-IDF Feature Extraction</h3>
            <p>
              Text is transformed across a 15,000-dimension feature vocabulary capturing both single words and unigram/bigram phrase pairs like <em>"verify account"</em>, <em>"update password"</em>, and <em>"suspended"</em>.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Cpu size={22} />
            </div>
            <h3>3. Ensemble Classification</h3>
            <p>
              An optimized 100-tree Random Forest classifier calculates the probability distribution across decision trees, producing a final verdict, confidence metric, and threat severity rating.
            </p>
          </div>
        </div>
      </section>

      {/* Dataset & Benchmark Section */}
      <section id="dataset" className="dataset-section">
        <div className="section-header">
          <div className="section-pill">Benchmark Data</div>
          <h2>Trained on 82,486 Real-World Emails</h2>
          <p>Trained and cross-validated on standard cybersecurity corpora rather than synthetic samples.</p>
        </div>

        <div className="dataset-grid">
          <div className="dataset-card">
            <div className="dataset-stat">42,891</div>
            <h4>Phishing Samples (52%)</h4>
            <p>Sourced from real attacks in the Jose Nazario Phishing Corpus, CEAS 2008, and Nigerian Fraud datasets.</p>
          </div>

          <div className="dataset-card">
            <div className="dataset-stat">39,595</div>
            <h4>Legitimate Samples (48%)</h4>
            <p>Composed of authentic corporate and personal communications from Enron and Apache SpamAssassin corpora.</p>
          </div>

          <div className="dataset-card">
            <div className="dataset-stat">98.64%</div>
            <h4>Test Set Accuracy</h4>
            <p>Evaluated on a stratified 20% holdout split of 16,498 unseen emails with a 0.99 F1-score.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="section-header">
          <div className="section-pill">Questions & Answers</div>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-list">
          <div className={`faq-item ${activeFaq === 0 ? 'open' : ''}`} onClick={() => toggleFaq(0)}>
            <div className="faq-question">
              <span>Is my email text stored or saved anywhere?</span>
              <ChevronDown size={18} className="faq-chevron" />
            </div>
            {activeFaq === 0 && (
              <div className="faq-answer">
                No. The system is 100% stateless. Email content is evaluated in memory on an AWS Lambda function and immediately discarded upon returning the prediction. No database or disk storage is involved.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFaq === 1 ? 'open' : ''}`} onClick={() => toggleFaq(1)}>
            <div className="faq-question">
              <span>What types of phishing attacks can it catch?</span>
              <ChevronDown size={18} className="faq-chevron" />
            </div>
            {activeFaq === 1 && (
              <div className="faq-answer">
                It identifies credential-harvesting pages, urgent account-suspension threats, fraudulent payroll or invoice update notices, lottery/award scams, and deceptive URL structures.
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFaq === 2 ? 'open' : ''}`} onClick={() => toggleFaq(2)}>
            <div className="faq-question">
              <span>What cloud technology powers this?</span>
              <ChevronDown size={18} className="faq-chevron" />
            </div>
            {activeFaq === 2 && (
              <div className="faq-answer">
                The frontend is built with React 19 and TypeScript, hosted on AWS Amplify with global CDN delivery. The backend ML model runs as a containerized microservice on AWS Lambda, scaling to zero when idle.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="nav-logo small">
              <Shield size={16} />
            </div>
            <span>PhishGuard AI</span>
            <span className="footer-sep">•</span>
            <span className="footer-note">Real-time Phishing Threat Detection</span>
          </div>
          <div className="footer-right">
            <span>Built for academic and informational security defense.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
