from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime
    total_seats: int

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    available_seats: int

    class Config:
        orm_mode = True
