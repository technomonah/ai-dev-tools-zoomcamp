"""
Tests for expense CRUD operations.
"""
import pytest


class TestIncomeOperations:
    """Tests for income update and delete."""

    def test_update_income(self, authenticated_client):
        """Test updating an income."""
        # Create month and income
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 6}
        )
        month_id = create_response.json()["id"]

        income_response = authenticated_client.post(
            f"/api/months/{month_id}/incomes",
            json={"name": "Salary", "amount": 5000}
        )
        income_id = income_response.json()["id"]

        # Update income
        response = authenticated_client.put(
            f"/api/incomes/{income_id}",
            json={"name": "Updated Salary", "amount": 5500}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Salary"
        assert data["amount"] == 5500

    def test_update_income_partial(self, authenticated_client):
        """Test partial update of income."""
        # Create month and income
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 6}
        )
        month_id = create_response.json()["id"]

        income_response = authenticated_client.post(
            f"/api/months/{month_id}/incomes",
            json={"name": "Salary", "amount": 5000}
        )
        income_id = income_response.json()["id"]

        # Update only amount
        response = authenticated_client.put(
            f"/api/incomes/{income_id}",
            json={"amount": 6000}
        )
        assert response.status_code == 200
        assert response.json()["amount"] == 6000
        assert response.json()["name"] == "Salary"

    def test_delete_income(self, authenticated_client):
        """Test deleting an income."""
        # Create month and income
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 6}
        )
        month_id = create_response.json()["id"]

        income_response = authenticated_client.post(
            f"/api/months/{month_id}/incomes",
            json={"name": "Bonus", "amount": 1000}
        )
        income_id = income_response.json()["id"]

        # Delete income
        response = authenticated_client.delete(f"/api/incomes/{income_id}")
        assert response.status_code == 200
        assert "deleted" in response.json()["message"]

        # Verify deletion
        incomes_response = authenticated_client.get(f"/api/months/{month_id}/incomes")
        assert len(incomes_response.json()) == 0

    def test_update_income_not_found(self, authenticated_client):
        """Test updating non-existent income."""
        response = authenticated_client.put(
            "/api/incomes/9999",
            json={"amount": 1000}
        )
        assert response.status_code == 404


class TestFixedExpenseOperations:
    """Tests for fixed expense update and delete."""

    def test_update_fixed_expense(self, authenticated_client):
        """Test updating a fixed expense."""
        # Create month and fixed expense
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 6}
        )
        month_id = create_response.json()["id"]

        expense_response = authenticated_client.post(
            f"/api/months/{month_id}/fixed-expenses",
            json={"name": "Rent", "amount": 1500}
        )
        expense_id = expense_response.json()["id"]

        # Update expense
        response = authenticated_client.put(
            f"/api/fixed-expenses/{expense_id}",
            json={"amount": 1600}
        )
        assert response.status_code == 200
        assert response.json()["amount"] == 1600

    def test_delete_fixed_expense(self, authenticated_client):
        """Test deleting a fixed expense."""
        # Create month and fixed expense
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 6}
        )
        month_id = create_response.json()["id"]

        expense_response = authenticated_client.post(
            f"/api/months/{month_id}/fixed-expenses",
            json={"name": "Internet", "amount": 50}
        )
        expense_id = expense_response.json()["id"]

        # Delete expense
        response = authenticated_client.delete(f"/api/fixed-expenses/{expense_id}")
        assert response.status_code == 200

        # Verify deletion
        expenses_response = authenticated_client.get(f"/api/months/{month_id}/fixed-expenses")
        assert len(expenses_response.json()) == 0


class TestDailyExpenseOperations:
    """Tests for daily expense update and delete."""

    def test_update_daily_expense(self, authenticated_client):
        """Test updating a daily expense."""
        # Create month and daily expense
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 6}
        )
        month_id = create_response.json()["id"]

        expense_response = authenticated_client.post(
            f"/api/months/{month_id}/daily-expenses",
            json={
                "date": "2024-06-15",
                "description": "Coffee",
                "amount": 5,
                "category": "Еда"
            }
        )
        expense_id = expense_response.json()["id"]

        # Update expense
        response = authenticated_client.put(
            f"/api/daily-expenses/{expense_id}",
            json={"description": "Coffee and snack", "amount": 10}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["description"] == "Coffee and snack"
        assert data["amount"] == 10

    def test_update_daily_expense_category(self, authenticated_client):
        """Test updating category of daily expense."""
        # Create month and daily expense
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 6}
        )
        month_id = create_response.json()["id"]

        expense_response = authenticated_client.post(
            f"/api/months/{month_id}/daily-expenses",
            json={
                "date": "2024-06-15",
                "description": "Taxi",
                "amount": 20,
                "category": "Прочее"
            }
        )
        expense_id = expense_response.json()["id"]

        # Update category
        response = authenticated_client.put(
            f"/api/daily-expenses/{expense_id}",
            json={"category": "Транспорт"}
        )
        assert response.status_code == 200
        assert response.json()["category"] == "Транспорт"

    def test_delete_daily_expense(self, authenticated_client):
        """Test deleting a daily expense."""
        # Create month and daily expense
        create_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 6}
        )
        month_id = create_response.json()["id"]

        expense_response = authenticated_client.post(
            f"/api/months/{month_id}/daily-expenses",
            json={
                "date": "2024-06-15",
                "description": "Lunch",
                "amount": 15
            }
        )
        expense_id = expense_response.json()["id"]

        # Delete expense
        response = authenticated_client.delete(f"/api/daily-expenses/{expense_id}")
        assert response.status_code == 200

        # Verify deletion
        expenses_response = authenticated_client.get(f"/api/months/{month_id}/daily-expenses")
        assert len(expenses_response.json()) == 0

    def test_delete_daily_expense_not_found(self, authenticated_client):
        """Test deleting non-existent daily expense."""
        response = authenticated_client.delete("/api/daily-expenses/9999")
        assert response.status_code == 404
