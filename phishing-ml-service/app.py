from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from api.routes import router

app = FastAPI(
    title="Phishing Detection Service",
    description="Real-time Phishing Email Detection API powered by ML"
)

# Enable CORS for web clients (Vercel, S3, localhost, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "Phishing Detection API",
        "version": "1.0.0"
    }

app.include_router(router)

# AWS Lambda entry point
handler = Mangum(app)