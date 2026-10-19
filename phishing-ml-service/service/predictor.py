import joblib

model = joblib.load("model/model.pkl")
vectorizer = joblib.load("model/vectorizer.pkl")


def predict_email(email_text):

    features = vectorizer.transform([email_text])

    prediction = model.predict(features)[0]

    probabilities = model.predict_proba(features)[0]

    confidence = max(probabilities)

    return {
        "prediction": "PHISHING" if prediction == 1 else "SAFE",
        "confidence": round(confidence * 100, 2)
    }