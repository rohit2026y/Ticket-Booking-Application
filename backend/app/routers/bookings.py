from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Booking, Event, User, BookingStatus
from app.schemas.booking_schemas import BookingCreate, BookingResponse
from app.core.deps import get_current_user
from app.services.lock_service import acquire_lock
from app.worker import send_confirmation_email, send_admin_notification
from typing import List

router = APIRouter()

@router.post("/", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Acquire Redis lock for the event to prevent race conditions
    with acquire_lock(f"event_{booking.event_id}") as acquired:
        if not acquired:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="System busy, please try again."
            )
        
        # 2. Check availability inside the lock
        event = db.query(Event).filter(Event.id == booking.event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        if event.available_seats < booking.seats_booked:
            raise HTTPException(
                status_code=400,
                detail="Not enough seats available"
            )
        
        # 3. Create booking and update seats
        new_booking = Booking(
            user_id=current_user.id,
            event_id=booking.event_id,
            seats_booked=booking.seats_booked,
            status=BookingStatus.CONFIRMED
        )
        event.available_seats -= booking.seats_booked
        
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        
        # 4. Trigger background tasks
        send_confirmation_email.delay(current_user.email, event.title, booking.seats_booked)
        send_admin_notification.delay(event.title, booking.seats_booked, current_user.email)
        
        return new_booking

@router.get("/", response_model=List[BookingResponse])
def read_user_bookings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
    return bookings
