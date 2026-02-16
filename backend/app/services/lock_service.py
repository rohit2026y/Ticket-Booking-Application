import redis
from app.core.config import settings
import time
from contextlib import contextmanager

# Initialize Redis client
# Using a connection pool is a good practice
pool = redis.ConnectionPool.from_url(settings.REDIS_URL, decode_responses=True)
redis_client = redis.Redis(connection_pool=pool)

@contextmanager
def acquire_lock(lock_name: str, acquire_timeout: int = 10, lock_timeout: int = 10):
    """
    Redis distributed lock implementation.
    """
    identifier = str(time.time())
    end_time = time.time() + acquire_timeout
    
    lock_key = f"lock:{lock_name}"
    
    while time.time() < end_time:
        if redis_client.set(lock_key, identifier, ex=lock_timeout, nx=True):
            try:
                yield True
            finally:
                # Only release the lock if it's still ours
                # We use a Lua script for atomicity but for simplicity here:
                if redis_client.get(lock_key) == identifier:
                    redis_client.delete(lock_key)
            return
        time.sleep(0.1)
    
    # Could not acquire lock
    yield False
