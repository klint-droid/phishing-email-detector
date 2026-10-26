import os
import joblib
import pandas as pd
from pathlib import Path
import kagglehub

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Resolve base directories
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "model"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / "model.pkl"
VECTORIZER_PATH = MODEL_DIR / "vectorizer.pkl"

print("1/5: Loading dataset via kagglehub...")
dataset_dir = kagglehub.dataset_download("naserabdullahalam/phishing-email-dataset")
csv_path = os.path.join(dataset_dir, "phishing_email.csv")

# 1. Read dataset
df = pd.read_csv(csv_path)
print(f"Loaded raw dataset with {len(df):,} records.")

# 2. Clean missing data
df = df.dropna(subset=["text_combined", "label"])
df["text_combined"] = df["text_combined"].astype(str)
df["label"] = df["label"].astype(int)

X = df["text_combined"]
y = df["label"]

# 3. Train-test split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"2/5: Split completed: {len(X_train):,} training samples, {len(X_test):,} testing samples.")

# 4. Feature Extraction (TF-IDF)
print("3/5: Vectorizing text using TF-IDF (max_features=15,000)...")
vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),
    max_features=15000,
    stop_words="english",
    sublinear_tf=True
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# 5. Train Classifier
print("4/5: Training RandomForestClassifier (100 estimators, all CPU cores)...")
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train_vec, y_train)

# 6. Evaluate
print("5/5: Evaluating model performance...")
y_pred = model.predict(X_test_vec)
acc = accuracy_score(y_test, y_pred)
print(f"\nTest Accuracy: {acc * 100:.2f}%\n")
print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=["SAFE", "PHISHING"]))

# 7. Save model and vectorizer
print(f"Saving model to {MODEL_PATH}...")
joblib.dump(model, MODEL_PATH)

print(f"Saving vectorizer to {VECTORIZER_PATH}...")
joblib.dump(vectorizer, VECTORIZER_PATH)

print("\nModel training and export completed successfully!")