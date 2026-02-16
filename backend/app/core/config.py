from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Ticket Booking API"
    DATABASE_URL: str
    SECRET_KEY: str = "supersecretkey" # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REDIS_URL: str = "redis://redis:6379/0"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
