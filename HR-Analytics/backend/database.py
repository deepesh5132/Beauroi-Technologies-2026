"""
Database Connection & Session Configuration.
Supports PostgreSQL production connection strings and SQLite fallback for local/standalone execution.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import logging

logger = logging.getLogger(__name__)

# Database Connection URL from Environment or SQLite Fallback
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "hr_analytics")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)

# SQLite fallback path for standalone dev mode
SQLITE_DB_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../hr_analytics.db")
)
FALLBACK_SQLITE_URL = f"sqlite:///{SQLITE_DB_PATH}"

engine = None

try:
    if "postgresql" in DATABASE_URL:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_size=10, max_overflow=20)
        # Test connection
        with engine.connect() as conn:
            logger.info("Successfully connected to PostgreSQL Database.")
    else:
        engine = create_engine(FALLBACK_SQLITE_URL, connect_args={"check_same_thread": False})
        logger.info(f"Connected to SQLite database at {SQLITE_DB_PATH}")
except Exception as e:
    logger.warning(f"PostgreSQL connection failed ({e}). Falling back to SQLite at {SQLITE_DB_PATH}")
    engine = create_engine(FALLBACK_SQLITE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency injector yielding a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
