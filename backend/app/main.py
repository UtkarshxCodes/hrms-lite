from fastapi import FastAPI
from .database import Base, engine
from .routes import employees, attendance

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite")

app.include_router(employees.router)
app.include_router(attendance.router)

@app.get("/")
def health():
    return {"status": "ok"}
