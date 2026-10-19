Phishing Email Detector

A machine learning-powered web application that detects phishing emails using Natural Language Processing (NLP) techniques. The system integrates a Spring Boot web application with a Python-based machine learning service to analyze email content and classify messages as either phishing or legitimate.

Overview

Phishing attacks remain one of the most common cybersecurity threats, often targeting users through deceptive emails designed to steal sensitive information. This project aims to help identify potentially malicious emails by leveraging machine learning models trained on email datasets.

The application consists of two main components:

A Spring Boot application that provides the user interface and handles requests.
A FastAPI machine learning service responsible for email classification.

Users can submit email content through the web interface, and the system returns a prediction indicating whether the email appears to be phishing or legitimate.

Features
Email content analysis
Phishing email detection using machine learning
Confidence score prediction
Spring Boot and FastAPI integration
Web-based interface using Thymeleaf
REST API communication between services
Machine learning model deployment with Python
System Architecture
User
  |
  v
Spring Boot + Thymeleaf
  |
  | HTTP Request
  v
FastAPI ML Service
  |
  v
TF-IDF Vectorizer
  |
  v
XGBoost Classifier
  |
  v
Prediction Result

Technology Stack
Backend
Java
Spring Boot
Spring MVC
Thymeleaf
Machine Learning
Python
FastAPI
Scikit-learn
XGBoost
Pandas
NumPy
Joblib
Build Tools
Maven or Gradle
Pip
Project Structure
phishing-email-detector/
│
├── spring-boot-app/
│   ├── controller/
│   ├── service/
│   ├── dto/
│   └── templates/
│
├── phishing-ml-service/
│   ├── api/
│   ├── model/
│   ├── service/
│   ├── training/
│   ├── app.py
│   └── requirements.txt
│
└── README.md

How It Works
A user enters email content through the web interface.
Spring Boot receives the request.
The application sends the email content to the FastAPI service.
The FastAPI service loads the trained machine learning model.
The email content is converted into numerical features using TF-IDF vectorization.
The XGBoost model generates a prediction.
The prediction and confidence score are returned to Spring Boot.
The result is displayed to the user.
Example
Input
URGENT!

Your account has been suspended.

Please verify your credentials immediately by clicking the link below:

https://example-login.com

Output
Prediction: PHISHING

Confidence: 98%

Installation
Clone the repository
git clone https://github.com/yourusername/phishing-email-detector.git
cd phishing-email-detector

Set up the Python service
cd phishing-ml-service


Create a virtual environment:

python -m venv venv


Activate the environment:

venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Run the FastAPI service:

uvicorn app:app --reload


The service will be available at:

http://localhost:8000

Run the Spring Boot application

Navigate to the Spring Boot project:

cd spring-boot-app


Run the application:

./gradlew bootRun


or

mvn spring-boot:run


The application will be available at:

http://localhost:8080

Machine Learning Model

The phishing detection model uses:

TF-IDF Vectorization for text feature extraction
XGBoost Classification for prediction

The model is trained on email datasets containing both phishing and legitimate email samples and is exposed through a FastAPI endpoint for real-time inference.

Learning Objectives

This project demonstrates practical implementation of:

Natural Language Processing (NLP)
Machine Learning Model Integration
RESTful API Communication
Microservice Architecture
Java Spring Boot Development
Python FastAPI Development
Web Application Development
Author

Klint Ruales

Software Development Intern

License

This project is provided for educational and learning purposes.
