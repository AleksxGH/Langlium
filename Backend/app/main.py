from fastapi import FastAPI
from .routers import auth_routes

app = FastAPI(title="Langlium API")

app.include_router(auth_routes.router)


@app.get("/")
def root():
    return {"status": "ok"}