import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

df = pd.read_csv("training/phishing.csv")

X = df["text"]
y = df["label"]

vectorizer = TfidfVectorizer()

X_vectorized = vectorizer.fit_transform(X)

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_vectorized, y)

joblib.dump(model, "model/model.pkl")
joblib.dump(vectorizer, "model/vectorizer.pkl")

print("Model training completed")