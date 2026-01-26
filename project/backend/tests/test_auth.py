"""
Tests for authentication endpoints.
"""
import pytest


class TestRegister:
    """Tests for user registration."""

    def test_register_success(self, client):
        """Test successful user registration."""
        response = client.post(
            "/api/auth/register",
            json={"email": "newuser@example.com", "password": "password123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["is_active"] is True
        assert "id" in data
        # Check that cookie is set
        assert "access_token" in response.cookies

    def test_register_duplicate_email(self, client, test_user):
        """Test registration with existing email."""
        response = client.post(
            "/api/auth/register",
            json={"email": "test@example.com", "password": "password123"}
        )
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"]

    def test_register_invalid_email(self, client):
        """Test registration with invalid email format."""
        response = client.post(
            "/api/auth/register",
            json={"email": "invalid-email", "password": "password123"}
        )
        assert response.status_code == 422

    def test_register_missing_password(self, client):
        """Test registration without password."""
        response = client.post(
            "/api/auth/register",
            json={"email": "user@example.com"}
        )
        assert response.status_code == 422


class TestLogin:
    """Tests for user login."""

    def test_login_success(self, client, test_user):
        """Test successful login."""
        response = client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "testpassword123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert "access_token" in response.cookies

    def test_login_wrong_password(self, client, test_user):
        """Test login with wrong password."""
        response = client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        assert "Invalid" in response.json()["detail"]

    def test_login_nonexistent_user(self, client):
        """Test login with non-existent user."""
        response = client.post(
            "/api/auth/login",
            json={"email": "nonexistent@example.com", "password": "password123"}
        )
        assert response.status_code == 401

    def test_login_inactive_user(self, client, db_session):
        """Test login with inactive user."""
        from app.models import User
        from app.auth.security import get_password_hash

        user = User(
            email="inactive@example.com",
            hashed_password=get_password_hash("password123"),
            is_active=False
        )
        db_session.add(user)
        db_session.commit()

        response = client.post(
            "/api/auth/login",
            json={"email": "inactive@example.com", "password": "password123"}
        )
        assert response.status_code == 401
        assert "inactive" in response.json()["detail"]


class TestLogout:
    """Tests for user logout."""

    def test_logout_success(self, authenticated_client):
        """Test successful logout."""
        response = authenticated_client.post("/api/auth/logout")
        assert response.status_code == 200
        assert "Logged out" in response.json()["message"]


class TestGetCurrentUser:
    """Tests for getting current user."""

    def test_get_me_authenticated(self, authenticated_client, test_user):
        """Test getting current user when authenticated."""
        response = authenticated_client.get("/api/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user.email
        assert data["id"] == test_user.id

    def test_get_me_unauthenticated(self, client):
        """Test getting current user when not authenticated."""
        response = client.get("/api/auth/me")
        assert response.status_code == 401

    def test_get_me_invalid_token(self, client):
        """Test getting current user with invalid token."""
        client.cookies.set("access_token", "invalid-token")
        response = client.get("/api/auth/me")
        assert response.status_code == 401
