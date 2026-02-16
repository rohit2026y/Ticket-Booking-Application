import sys
from app.core.database import SessionLocal
from app.models.models import Event, User
from app.core.security import get_password_hash
from datetime import datetime, timedelta

db = SessionLocal()

# Create Admin
if not db.query(User).filter_by(email="admin@example.com").first():
    admin = User(email="admin@example.com", hashed_password=get_password_hash("admin123"), is_admin=True)
    db.add(admin)
    print("Admin created")

# Create Event
if not db.query(Event).first():
    event = Event(
        title="Avengers: Secret Wars",
        description="The ultimate marvel showdown.",
        date=datetime.now() + timedelta(days=7),
        total_seats=100,
        available_seats=100
    )
    db.add(event)
    print("Event created")

db.commit()
print("Seeding complete.")
