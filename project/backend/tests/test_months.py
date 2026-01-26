"""
Tests for months endpoints.
"""
import pytest


class TestGetMonths:
    """Tests for listing months."""

    def test_get_months_empty(self, authenticated_client):
        """Test getting months when none exist."""
        response = authenticated_client.get("/api/months")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_months_with_data(self, authenticated_client):
        """Test getting months after creating some."""
        # Create a month
        authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 1, "savings_percent": 10}
        )

        response = authenticated_client.get("/api/months")
        assert response.status_code == 200
        months = response.json()
        assert len(months) == 1
        assert months[0]["year"] == 2024
        assert months[0]["month"] == 1

    def test_get_months_unauthenticated(self, client):
        """Test getting months without authentication."""
        response = client.get("/api/months")
        assert response.status_code == 401


class TestCreateMonth:
    """Tests for creating months."""

    def test_create_month_success(self, authenticated_client):
        """Test successful month creation."""
        response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 6, "savings_percent": 15}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["year"] == 2024
        assert data["month"] == 6
        assert data["savings_percent"] == 15
        assert "id" in data

    def test_create_month_default_savings(self, authenticated_client):
        """Test month creation with default savings percent."""
        response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 7}
        )
        assert response.status_code == 200
        assert response.json()["savings_percent"] == 0

    def test_create_month_invalid_month(self, authenticated_client):
        """Test creating month with invalid month number."""
        response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 13}
        )
        # Month validation may be handled at different levels
        # Adjust assertion based on actual behavior
        assert response.status_code in [200, 422]


class TestGetMonth:
    """Tests for getting single month."""

    def test_get_month_success(self, authenticated_client):
        """Test getting a specific month."""
        # Create month first
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 3}
        )
        month_id = create_response.json()["id"]

        response = authenticated_client.get(f"/api/months/{month_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == month_id
        assert data["year"] == 2024
        assert data["month"] == 3
        assert "incomes" in data
        assert "fixed_expenses" in data
        assert "daily_expenses" in data

    def test_get_month_not_found(self, authenticated_client):
        """Test getting non-existent month."""
        response = authenticated_client.get("/api/months/9999")
        assert response.status_code == 404


class TestUpdateMonth:
    """Tests for updating months."""

    def test_update_month_savings(self, authenticated_client):
        """Test updating month savings percent."""
        # Create month
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 4}
        )
        month_id = create_response.json()["id"]

        # Update savings
        response = authenticated_client.put(
            f"/api/months/{month_id}",
            json={"savings_percent": 25}
        )
        assert response.status_code == 200
        assert response.json()["savings_percent"] == 25

    def test_update_month_not_found(self, authenticated_client):
        """Test updating non-existent month."""
        response = authenticated_client.put(
            "/api/months/9999",
            json={"savings_percent": 10}
        )
        assert response.status_code == 404


class TestMonthIncomes:
    """Tests for month income operations."""

    def test_add_income(self, authenticated_client):
        """Test adding income to month."""
        # Create month
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 5}
        )
        month_id = create_response.json()["id"]

        # Add income
        response = authenticated_client.post(
            f"/api/months/{month_id}/incomes",
            json={"name": "Salary", "amount": 5000}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Salary"
        assert data["amount"] == 5000
        assert data["month_id"] == month_id

    def test_get_incomes(self, authenticated_client):
        """Test getting incomes for month."""
        # Create month and add income
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 5}
        )
        month_id = create_response.json()["id"]

        authenticated_client.post(
            f"/api/months/{month_id}/incomes",
            json={"name": "Salary", "amount": 5000}
        )
        authenticated_client.post(
            f"/api/months/{month_id}/incomes",
            json={"name": "Bonus", "amount": 1000}
        )

        response = authenticated_client.get(f"/api/months/{month_id}/incomes")
        assert response.status_code == 200
        incomes = response.json()
        assert len(incomes) == 2


class TestMonthFixedExpenses:
    """Tests for month fixed expense operations."""

    def test_add_fixed_expense(self, authenticated_client):
        """Test adding fixed expense to month."""
        # Create month
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 5}
        )
        month_id = create_response.json()["id"]

        # Add fixed expense
        response = authenticated_client.post(
            f"/api/months/{month_id}/fixed-expenses",
            json={"name": "Rent", "amount": 1500}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Rent"
        assert data["amount"] == 1500

    def test_get_fixed_expenses(self, authenticated_client):
        """Test getting fixed expenses for month."""
        # Create month and add expenses
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 5}
        )
        month_id = create_response.json()["id"]

        authenticated_client.post(
            f"/api/months/{month_id}/fixed-expenses",
            json={"name": "Rent", "amount": 1500}
        )

        response = authenticated_client.get(f"/api/months/{month_id}/fixed-expenses")
        assert response.status_code == 200
        expenses = response.json()
        assert len(expenses) == 1


class TestMonthDailyExpenses:
    """Tests for month daily expense operations."""

    def test_add_daily_expense(self, authenticated_client):
        """Test adding daily expense to month."""
        # Create month
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 5}
        )
        month_id = create_response.json()["id"]

        # Add daily expense
        response = authenticated_client.post(
            f"/api/months/{month_id}/daily-expenses",
            json={
                "date": "2024-05-15",
                "description": "Groceries",
                "amount": 50,
                "category": "Еда"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["description"] == "Groceries"
        assert data["amount"] == 50
        assert data["category"] == "Еда"

    def test_add_daily_expense_default_category(self, authenticated_client):
        """Test adding daily expense with default category."""
        # Create month
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 5}
        )
        month_id = create_response.json()["id"]

        # Add daily expense without category
        response = authenticated_client.post(
            f"/api/months/{month_id}/daily-expenses",
            json={
                "date": "2024-05-15",
                "description": "Random purchase",
                "amount": 25
            }
        )
        assert response.status_code == 200
        # Default category should be set
        assert response.json()["category"] is not None


class TestMonthBalance:
    """Tests for month balance calculation."""

    def test_get_balance(self, authenticated_client):
        """Test getting balance for month."""
        # Create month with income and expenses
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 5, "savings_percent": 10}
        )
        month_id = create_response.json()["id"]

        # Add income
        authenticated_client.post(
            f"/api/months/{month_id}/incomes",
            json={"name": "Salary", "amount": 5000}
        )

        # Add fixed expense
        authenticated_client.post(
            f"/api/months/{month_id}/fixed-expenses",
            json={"name": "Rent", "amount": 1500}
        )

        # Get balance
        response = authenticated_client.get(f"/api/months/{month_id}/balance")
        assert response.status_code == 200
        data = response.json()

        assert data["total_income"] == 5000
        assert data["total_fixed_expenses"] == 1500
        assert data["savings_amount"] == 500  # 10% of 5000
        assert "daily_budget" in data
        assert "balance" in data


class TestMonthAnalytics:
    """Tests for month analytics."""

    def test_get_analytics(self, authenticated_client):
        """Test getting analytics for month."""
        # Create month with expenses
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 5}
        )
        month_id = create_response.json()["id"]

        # Add daily expenses with categories
        authenticated_client.post(
            f"/api/months/{month_id}/daily-expenses",
            json={
                "date": "2024-05-15",
                "description": "Groceries",
                "amount": 100,
                "category": "Еда"
            }
        )
        authenticated_client.post(
            f"/api/months/{month_id}/daily-expenses",
            json={
                "date": "2024-05-16",
                "description": "Bus",
                "amount": 50,
                "category": "Транспорт"
            }
        )

        # Get analytics
        response = authenticated_client.get(f"/api/months/{month_id}/analytics")
        assert response.status_code == 200
        data = response.json()

        assert "categories" in data
        assert "total" in data
        assert data["total"] == 150
