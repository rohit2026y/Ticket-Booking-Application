from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.models import BookingStatus

class BookingBase(BaseModel):
    event_id: int
    seats_booked: int

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    user_id: int
    status: BookingStatus
    created_at: datetime

    class Config:
        orm_mode = True
