"""
Pytest configuration and fixtures for backend tests.
"""
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Set test environment before importing app modules
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret-key-for-testing"

from app.database import Base, get_db
from app.main import app
from app.models import User
from app.auth.security import get_password_hash, create_access_token


# Create test database engine with in-memory SQLite
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Override the dependency
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    # Create all tables
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop all tables after test
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with fresh database."""
    # Recreate tables for this test
    Base.metadata.create_all(bind=engine)

    with TestClient(app) as test_client:
        yield test_client

    # Cleanup
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def test_user(db_session) -> User:
    """Create a test user in the database."""
    user = User(
        email="test@example.com",
        hashed_password=get_password_hash("testpassword123"),
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def auth_cookies(test_user) -> dict:
    """Create authentication cookies for test user."""
    token = create_access_token(data={"sub": str(test_user.id)})
    return {"access_token": token}


@pytest.fixture
def authenticated_client(client, auth_cookies):
    """Create an authenticated test client."""
    client.cookies.set("access_token", auth_cookies["access_token"])
    return client


@pytest.fixture
def second_user(db_session) -> User:
    """Create a second test user for isolation tests."""
    user = User(
        email="second@example.com",
        hashed_password=get_password_hash("secondpassword123"),
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def second_auth_cookies(second_user) -> dict:
    """Create authentication cookies for second user."""
    token = create_access_token(data={"sub": str(second_user.id)})
    return {"access_token": token}
