from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.models import Booking, Event, BookingStatus
from app.core.deps import get_current_active_admin, get_current_user

router = APIRouter()

@router.get("/total-bookings", response_model=Dict[str, int])
def get_total_bookings(
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_admin)
):
    """
    Get the total number of confirmed bookings across all events.
    Only accessible by admins.
    """
    total_bookings = db.query(func.sum(Booking.seats_booked)).filter(
        Booking.status == BookingStatus.CONFIRMED
    ).scalar() or 0
    
    return {"total_seats_booked": total_bookings}

@router.get("/event-summary", response_model=List[Dict[str, Any]])
def get_event_summary(
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_admin)
):
    """
    Get a summary of bookings per event.
    Returns event title, total seats booked, and total revenue (simulated).
    Only accessible by admins.
    """
    events = db.query(Event).all()
    summary = []
    
    for event in events:
        seats_booked = db.query(func.sum(Booking.seats_booked)).filter(
            Booking.event_id == event.id,
            Booking.status == BookingStatus.CONFIRMED
        ).scalar() or 0
        
        summary.append({
            "event_id": event.id,
            "event_title": event.title,
            "total_seats_booked": seats_booked,
            "available_seats": event.available_seats,
            "total_seats": event.total_seats
        })
        
    return summary
