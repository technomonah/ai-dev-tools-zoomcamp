"""
Tests for categories and category detection.
"""
import pytest


class TestGetCategories:
    """Tests for getting categories."""

    def test_get_categories(self, authenticated_client):
        """Test getting list of categories."""
        response = authenticated_client.get("/api/categories")
        assert response.status_code == 200
        categories = response.json()
        # Should have default categories
        assert isinstance(categories, list)

    def test_get_categories_unauthenticated(self, client):
        """Test getting categories without authentication."""
        response = client.get("/api/categories")
        assert response.status_code == 401


class TestDetectCategory:
    """Tests for category detection."""

    def test_detect_category_food(self, authenticated_client):
        """Test detecting food-related category."""
        response = authenticated_client.post(
            "/api/detect-category",
            json={"description": "Обед в кафе"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "category" in data
        # Should detect food category
        assert data["category"] in ["Еда", "Рестораны", "Прочее"]

    def test_detect_category_transport(self, authenticated_client):
        """Test detecting transport-related category."""
        response = authenticated_client.post(
            "/api/detect-category",
            json={"description": "Такси до работы"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "category" in data
        assert data["category"] in ["Транспорт", "Прочее"]

    def test_detect_category_groceries(self, authenticated_client):
        """Test detecting grocery category."""
        response = authenticated_client.post(
            "/api/detect-category",
            json={"description": "Продукты в магазине"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "category" in data

    def test_detect_category_unknown(self, authenticated_client):
        """Test detecting category for unknown description."""
        response = authenticated_client.post(
            "/api/detect-category",
            json={"description": "Something random xyz"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "category" in data
        # Unknown items should default to "Прочее" or similar

    def test_detect_category_empty_description(self, authenticated_client):
        """Test detecting category with empty description."""
        response = authenticated_client.post(
            "/api/detect-category",
            json={"description": ""}
        )
        assert response.status_code == 200
        # Should return default category

    def test_detect_category_unauthenticated(self, client):
        """Test category detection without authentication."""
        response = client.post(
            "/api/detect-category",
            json={"description": "test"}
        )
        assert response.status_code == 401
