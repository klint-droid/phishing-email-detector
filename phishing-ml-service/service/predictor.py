from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model" / "model.pkl"
VECTORIZER_PATH = BASE_DIR / "model" / "vectorizer.pkl"

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)


def predict_email(email_text):

    features = vectorizer.transform([email_text])

    prediction = model.predict(features)[0]

    probabilities = model.predict_proba(features)[0]

    confidence = max(probabilities)

    return {
        "prediction": "PHISHING" if prediction == 1 else "SAFE",
        "confidence": round(float(confidence) * 100, 2)
    }