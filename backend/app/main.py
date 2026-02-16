from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, events, bookings, reports
from app.core.database import engine, Base
from app.models import models

app = FastAPI(title="Ticket Booking API")

origins = [
    "http://localhost:3000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(events.router, prefix="/events", tags=["events"])
app.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Ticket Booking API"}
