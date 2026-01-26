"""
Integration tests for complete workflows.
"""
import pytest


class TestCompleteWorkflow:
    """Tests for complete user workflows."""

    def test_full_month_workflow(self, authenticated_client):
        """Test complete workflow: create month, add income, expenses, check balance."""
        # Step 1: Create a month
        month_response = authenticated_client.post(
            "/api/months",
            json={"year": 2024, "month": 7, "savings_percent": 10}
        )
        assert month_response.status_code == 200
        month_id = month_response.json()["id"]

        # Step 2: Add income
        income_response = authenticated_client.post(
            f"/api/months/{month_id}/incomes",
            json={"name": "Salary", "amount": 100000}
        )
        assert income_response.status_code == 200

        authenticated_client.post(
            f"/api/months/{month_id}/incomes",
            json={"name": "Freelance", "amount": 20000}
        )

        # Step 3: Add fixed expenses
        authenticated_client.post(
            f"/api/months/{month_id}/fixed-expenses",
            json={"name": "Rent", "amount": 30000}
        )
        authenticated_client.post(
            f"/api/months/{month_id}/fixed-expenses",
            json={"name": "Utilities", "amount": 5000}
        )

        # Step 4: Add daily expenses
        authenticated_client.post(
            f"/api/months/{month_id}/daily-expenses",
            json={
                "date": "2024-07-01",
                "description": "Groceries",
                "amount": 3000,
                "category": "Еда"
            }
        )
        authenticated_client.post(
            f"/api/months/{month_id}/daily-expenses",
            json={
                "date": "2024-07-02",
                "description": "Transport",
                "amount": 500,
                "category": "Транспорт"
            }
        )

        # Step 5: Check balance
        balance_response = authenticated_client.get(f"/api/months/{month_id}/balance")
        assert balance_response.status_code == 200
        balance = balance_response.json()

        # Verify calculations
        assert balance["total_income"] == 120000  # 100000 + 20000
        assert balance["total_fixed_expenses"] == 35000  # 30000 + 5000
        assert balance["savings_amount"] == 12000  # 10% of 120000
        assert balance["actual_spent"] == 3500  # 3000 + 500

        # Available budget = income - fixed - savings = 120000 - 35000 - 12000 = 73000
        assert balance["available_budget"] == 73000

        # Step 6: Check analytics
        analytics_response = authenticated_client.get(f"/api/months/{month_id}/analytics")
        assert analytics_response.status_code == 200
        analytics = analytics_response.json()

        assert analytics["total"] == 3500
        assert len(analytics["categories"]) >= 2  # At least 2 categories

    def test_register_and_use_workflow(self, client, db_session):
        """Test complete workflow: register, create data, verify."""
        # Step 1: Register new user
        register_response = client.post(
            "/api/auth/register",
            json={"email": "workflow@test.com", "password": "securepass123"}
        )
        assert register_response.status_code == 200
        user_id = register_response.json()["id"]

        # Cookie should be set automatically
        assert "access_token" in client.cookies

        # Step 2: Verify user is logged in
        me_response = client.get("/api/auth/me")
        assert me_response.status_code == 200
        assert me_response.json()["email"] == "workflow@test.com"

        # Step 3: Create month
        month_response = client.post(
            "/api/months",
            json={"year": 2024, "month": 8}
        )
        assert month_response.status_code == 200
        month_id = month_response.json()["id"]

        # Step 4: Add data
        client.post(
            f"/api/months/{month_id}/incomes",
            json={"name": "Income", "amount": 50000}
        )

        # Step 5: Logout
        logout_response = client.post("/api/auth/logout")
        assert logout_response.status_code == 200

        # Step 6: Verify can't access data after logout
        # Clear cookie manually for test
        client.cookies.clear()
        months_response = client.get("/api/months")
        assert months_response.status_code == 401


class TestDataIsolation:
    """Tests for data isolation between users."""

    def test_user_cannot_see_other_user_months(
        self, client, test_user, second_user, auth_cookies, second_auth_cookies, db_session
    ):
        """Test that users cannot see each other's months."""
        # User 1 creates a month
        client.cookies.set("access_token", auth_cookies["access_token"])
        month_response = client.post(
            "/api/months",
            json={"year": 2024, "month": 9}
        )
        assert month_response.status_code == 200
        user1_month_id = month_response.json()["id"]

        # User 1 sees their month
        months_response = client.get("/api/months")
        assert len(months_response.json()) == 1

        # Switch to User 2
        client.cookies.clear()
        client.cookies.set("access_token", second_auth_cookies["access_token"])

        # User 2 should not see User 1's months
        months_response = client.get("/api/months")
        assert len(months_response.json()) == 0

        # User 2 cannot access User 1's month directly
        month_response = client.get(f"/api/months/{user1_month_id}")
        assert month_response.status_code == 404

    def test_user_cannot_modify_other_user_income(
        self, client, test_user, second_user, auth_cookies, second_auth_cookies, db_session
    ):
        """Test that users cannot modify each other's incomes."""
        # User 1 creates month and income
        client.cookies.set("access_token", auth_cookies["access_token"])
        month_response = client.post(
            "/api/months",
            json={"year": 2024, "month": 10}
        )
        month_id = month_response.json()["id"]

        income_response = client.post(
            f"/api/months/{month_id}/incomes",
            json={"name": "User1 Salary", "amount": 5000}
        )
        income_id = income_response.json()["id"]

        # Switch to User 2
        client.cookies.clear()
        client.cookies.set("access_token", second_auth_cookies["access_token"])

        # User 2 cannot update User 1's income
        update_response = client.put(
            f"/api/incomes/{income_id}",
            json={"amount": 1}
        )
        assert update_response.status_code == 404

        # User 2 cannot delete User 1's income
        delete_response = client.delete(f"/api/incomes/{income_id}")
        assert delete_response.status_code == 404

    def test_user_cannot_add_to_other_user_month(
        self, client, test_user, second_user, auth_cookies, second_auth_cookies, db_session
    ):
        """Test that users cannot add expenses to each other's months."""
        # User 1 creates month
        client.cookies.set("access_token", auth_cookies["access_token"])
        month_response = client.post(
            "/api/months",
            json={"year": 2024, "month": 11}
        )
        month_id = month_response.json()["id"]

        # Switch to User 2
        client.cookies.clear()
        client.cookies.set("access_token", second_auth_cookies["access_token"])

        # User 2 cannot add income to User 1's month
        income_response = client.post(
            f"/api/months/{month_id}/incomes",
            json={"name": "Malicious", "amount": 999999}
        )
        assert income_response.status_code == 404

        # User 2 cannot add daily expense to User 1's month
        expense_response = client.post(
            f"/api/months/{month_id}/daily-expenses",
            json={
                "date": "2024-11-01",
                "description": "Malicious",
                "amount": 1
            }
        )
        assert expense_response.status_code == 404


class TestHealthCheck:
    """Tests for health check endpoint."""

    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "leprecoin-api"

    def test_root_endpoint(self, client):
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "docs" in data
