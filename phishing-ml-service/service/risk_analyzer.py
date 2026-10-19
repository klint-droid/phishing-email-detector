PHISHING_KEYWORDS = [
    "urgent",
    "verify",
    "suspended",
    "password",
    "bank",
    "account",
    "login",
    "click now",
    "immediately",
    "limited time"
]


def analyze_risk(email_text, suspicious_urls):

    score = 0
    reasons = []

    email_lower = email_text.lower()

    keyword_count = 0

    for keyword in PHISHING_KEYWORDS:

        if keyword in email_lower:
            keyword_count += 1

    if keyword_count > 0:
        score += keyword_count * 10
        reasons.append(
            f"{keyword_count} phishing keywords detected"
        )

    if suspicious_urls:
        score += 30
        reasons.append(
            "Suspicious URL detected"
        )

    score = min(score, 100)

    if score >= 70:
        level = "HIGH"
    elif score >= 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "risk_score": score,
        "risk_level": level,
        "reasons": reasons
    }