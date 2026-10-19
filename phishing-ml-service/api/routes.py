from fastapi import APIRouter
from pydantic import BaseModel

from service.predictor import predict_email
from service.url_analyzer import analyze_urls
from service.risk_analyzer import analyze_risk

router = APIRouter()


class EmailRequest(BaseModel):
    email: str


@router.post("/predict")
def predict(request: EmailRequest):

    prediction = predict_email(request.email)

    suspicious_urls = analyze_urls(
        request.email
    )

    risk = analyze_risk(
        request.email,
        suspicious_urls
    )

    return {
        **prediction,
        **risk,
        "suspicious_urls": suspicious_urls
    }