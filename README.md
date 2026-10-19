# Phishing Email Detector

A machine learning-powered phishing email detection system built using **Spring Boot**, **FastAPI**, **XGBoost**, and **PostgreSQL**. The application analyzes email content and predicts whether an email is legitimate or a phishing attempt, providing confidence scores and centralized scan management.

---

## 🚀 Features

- ✅ Phishing email classification using Machine Learning
- ✅ XGBoost model trained on phishing and legitimate email datasets
- ✅ FastAPI-based ML inference service
- ✅ Spring Boot backend integration
- ✅ Thymeleaf web interface
- ✅ Real-time email analysis
- ✅ Confidence score prediction
- ✅ PostgreSQL database integration
- ✅ Scan history and tracking
- ✅ REST-based microservice architecture

---

## 🏗️ Architecture

```text
+--------------------+
|       Browser      |
+----------+---------+
           |
           v
+--------------------+
| Spring Boot        |
| Thymeleaf UI       |
| REST Controller    |
+----------+---------+
           |
           | HTTP POST
           v
+--------------------+
| FastAPI ML Service |
+----------+---------+
           |
           v
+--------------------+
| TF-IDF Vectorizer  |
| XGBoost Model      |
+--------------------+
           |
           v
+--------------------+
| PostgreSQL         |
+--------------------+

🛠️ Technology Stack
Backend
Java 21
Spring Boot
Spring MVC
Spring Data JPA
PostgreSQL
Machine Learning
Python
FastAPI
Scikit-learn
XGBoost
Pandas
Joblib
Frontend
Thymeleaf
HTML5
Bootstrap (optional)
📂 Project Structure
phishing-email-detector
│
├── spring-boot-app
│   ├── controller
│   ├── service
│   ├── dto
│   ├── entity
│   ├── repository
│   └── templates
│
├── phishing-ml-service
│   ├── api
│   ├── model
│   ├── service
│   ├── training
│   ├── app.py
│   └── requirements.txt
│
└── database

🧠 Machine Learning Pipeline
Email datasets are collected and cleaned.
Email content is converted into numerical features using TF-IDF.
An XGBoost classifier is trained on the processed data.
The trained model is serialized using Joblib.
FastAPI loads the model and serves prediction endpoints.
Spring Boot sends email content for analysis and displays results to users.
📊 Prediction Example
Input
URGENT!

Your account has been suspended.
Please verify your credentials immediately:

https://secure-bank-login.xyz

Output
{
  "prediction": "PHISHING",
  "confidence": 0.98
}

⚙️ Installation
1. Clone Repository
git clone https://github.com/yourusername/phishing-email-detector.git
cd phishing-email-detector

2. Start PostgreSQL

Create a database:

CREATE DATABASE phishing_detector;


Update Spring Boot configuration:

spring.datasource.url=jdbc:postgresql://localhost:5432/phishing_detector
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update

3. Start ML Service

Navigate to:

cd phishing-ml-service


Create virtual environment:

python -m venv venv


Activate:

venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Run FastAPI:

uvicorn app:app --reload


ML service available at:

http://localhost:8000


Swagger documentation:

http://localhost:8000/docs

4. Start Spring Boot Application

Navigate to:

cd spring-boot-app


Run:

./gradlew bootRun


or

mvn spring-boot:run


Application available at:

http://localhost:8080

🔌 API Endpoint
Analyze Email

POST

/api/analyze


Request:

{
  "email": "Click here to verify your account."
}


Response:

{
  "prediction": "PHISHING",
  "confidence": 0.96
}

📈 Future Enhancements
URL reputation analysis
Explainable AI (XAI)
Email attachment scanning
User authentication and authorization
Dashboard and analytics
Microsoft Outlook integration
Gmail integration
Transformer-based models (BERT/DistilBERT)
Real-time email monitoring
🎯 Learning Outcomes

This project demonstrates:

Machine Learning Engineering
Natural Language Processing (NLP)
Microservices Architecture
REST API Development
Spring Boot Development
FastAPI Development
PostgreSQL Database Management
Model Deployment and Integration
👨‍💻 Author

Klint Ruales

Software Development Intern

📄 License

This project is licensed under the MIT License.

Feel free to use, modify, and distribute this project for educational and professional purposes.


For GitHub, I'd name the repo:

**`phishing-email-detector`**

It's simple, professional, searchable, and immediately tells recruiters what the project does.