from celery import Celery
from app.core.config import settings
import time

celery_app = Celery(
    "worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery = celery_app

celery_app.conf.task_routes = {
    "app.worker.send_confirmation_email": "main-queue"
}

@celery_app.task(name="send_confirmation_email")
def send_confirmation_email(email: str, event_title: str, seats: int):
    # Simulate email sending
    print(f"Sending confirmation email to {email} for {seats} seats in '{event_title}'")
    time.sleep(2) # Simulate network delay
    return f"Email sent to {email}"

@celery_app.task(name="send_admin_notification")
def send_admin_notification(event_title: str, seats: int, user_email: str):
    # Simulate admin notification
    admin_email = "admin@example.com"
    print(f"Sending admin notification to {admin_email}: User {user_email} booked {seats} seats for '{event_title}'")
    time.sleep(1)
    return f"Admin notification sent for {user_email}"
