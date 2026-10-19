from fastapi import FastAPI

from api.routes import router

app = FastAPI(
    title="Phishing Detection Service"
)

app.include_router(router)