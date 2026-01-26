# Leprecoin - Personal Finance Manager

<p align="center">
  <img src="docs/logo.png" alt="Leprecoin Logo" width="120" />
</p>

A modern web application for managing personal finances with daily budget tracking, expense categorization, and financial analytics.

## Problem Statement

Managing personal finances can be challenging without proper tools. Many people struggle with:

- **Overspending**: Not knowing how much they can safely spend each day
- **Budget tracking**: Difficulty tracking expenses against a monthly budget
- **Category analysis**: Understanding where money goes each month
- **Savings goals**: Automatically allocating money for savings before spending

Leprecoin solves these problems by providing:
- Daily budget calculations based on income and fixed expenses
- Real-time balance tracking showing if you're under or over budget
- Automatic expense categorization using keyword detection
- Visual analytics with category breakdown charts
- Savings percentage configuration for automatic savings allocation

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Monthly Budget Management**: Create and manage monthly financial periods
- **Income Tracking**: Add multiple income sources per month
- **Fixed Expenses**: Track recurring monthly expenses (rent, subscriptions, etc.)
- **Daily Expenses**: Log day-to-day purchases with automatic categorization
- **Smart Category Detection**: AI-powered keyword matching for expense categories
- **Balance Dashboard**: Real-time view of daily budget and spending status
- **Analytics**: Visual charts showing spending by category
- **Savings Goals**: Configure percentage of income to save automatically

## Screenshots

<details>
<summary>Click to view screenshots</summary>

### Dashboard
The main dashboard shows your current balance, daily budget, and spending status.

### Daily Expenses
Track your daily purchases with automatic category detection.

### Analytics
Visual breakdown of spending by category.

</details>

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                │
│                    React + TypeScript                           │
│                    Tailwind CSS + Vite                          │
│                         Port 3000                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Backend                                │
│                     FastAPI (Python)                            │
│                    JWT Authentication                           │
│                         Port 8000                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQLAlchemy ORM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Database                                │
│               PostgreSQL (production/docker)                    │
│               SQLite (development/testing)                      │
│                         Port 5432                               │
└─────────────────────────────────────────────────────────────────┘
```

### Data Model

```
User (1) ─────< Month (N) ─────< Income (N)
                    │
                    ├──────────< FixedExpense (N)
                    │
                    └──────────< DailyExpense (N)

User (1) ─────< Category (N)
```

## Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11 | Runtime environment |
| FastAPI | 0.109 | Web framework |
| SQLAlchemy | 2.0 | ORM for database operations |
| Pydantic | 2.5 | Data validation |
| python-jose | 3.3 | JWT token handling |
| passlib | 1.7 | Password hashing |
| PostgreSQL | 15 | Production database |
| SQLite | 3 | Development/testing database |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2 | UI library |
| TypeScript | 5.3 | Type-safe JavaScript |
| Vite | 5.0 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first CSS framework |
| React Router | 6.22 | Client-side routing |
| Axios | 1.6 | HTTP client |
| Recharts | 2.10 | Chart library for analytics |
| Lucide React | 0.563 | Icon library |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| GitHub Actions | CI/CD pipeline |

## Getting Started

### Prerequisites

- Node.js 20+ (for frontend)
- Python 3.11+ (for backend)
- Docker and Docker Compose (optional, for containerized setup)

### Quick Start with Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/your-username/leprecoin.git
cd leprecoin
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Start all services:
```bash
docker-compose up --build
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development Setup

#### Backend

1. Create and activate virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set environment variables (uses SQLite by default):
```bash
export DATABASE_URL=sqlite:///./leprecoin.db
export SECRET_KEY=your-secret-key-for-development
```

4. Run the server:
```bash
uvicorn app.main:app --reload --port 8000
```

#### Frontend

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Access at http://localhost:3000

## API Documentation

The API documentation is available via Swagger UI at `/docs` when the backend is running.

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/months` | List all months |
| POST | `/api/months` | Create new month |
| GET | `/api/months/{id}` | Get month details |
| GET | `/api/months/{id}/balance` | Get balance for month |
| POST | `/api/months/{id}/incomes` | Add income |
| POST | `/api/months/{id}/fixed-expenses` | Add fixed expense |
| POST | `/api/months/{id}/daily-expenses` | Add daily expense |
| GET | `/api/categories` | List categories |
| POST | `/api/categories/detect` | Detect category for description |

Full OpenAPI specification: [docs/openapi.json](docs/openapi.json)

## Testing

### Backend Tests

```bash
cd backend
pip install pytest pytest-asyncio httpx
pytest -v
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Integration Tests

```bash
cd backend
pytest tests/test_integration.py -v
```

## Deployment

The application can be deployed to any cloud platform that supports Docker containers.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | SQLite local file |
| `SECRET_KEY` | JWT signing key | (required in production) |
| `POSTGRES_USER` | PostgreSQL username | leprecoin |
| `POSTGRES_PASSWORD` | PostgreSQL password | leprecoin123 |
| `POSTGRES_DB` | PostgreSQL database name | leprecoin |

## Project Structure

```
leprecoin/
├── backend/
│   ├── app/
│   │   ├── auth/           # Authentication module
│   │   │   ├── router.py   # Auth endpoints
│   │   │   ├── security.py # Password hashing, JWT
│   │   │   └── dependencies.py
│   │   ├── routers/        # API route handlers
│   │   │   ├── months.py
│   │   │   ├── expenses.py
│   │   │   ├── categories.py
│   │   │   └── profile.py
│   │   ├── main.py         # FastAPI application
│   │   ├── database.py     # Database configuration
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── crud.py         # Database operations
│   │   └── category_detector.py
│   ├── tests/              # Backend tests
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── Dockerfile
├── docs/
│   └── openapi.json        # API specification
├── .github/
│   └── workflows/
│       └── ci.yml          # CI/CD pipeline
├── docker-compose.yml
├── .env.example
└── README.md
```

## AI-Assisted Development

This project was developed with assistance from **Claude Code** (Anthropic's AI coding assistant).

### How AI Was Used

1. **Architecture Design**: Claude helped design the database schema and API structure, suggesting best practices for FastAPI and SQLAlchemy integration.

2. **Code Implementation**: Major components were developed through iterative prompts:
   - Backend API endpoints and authentication system
   - Frontend React components with TypeScript
   - Database models and CRUD operations

3. **Testing**: Claude generated comprehensive test suites for both backend (pytest) and frontend (Vitest).

4. **Documentation**: This README and API documentation were created with AI assistance.

5. **Bug Fixes**: AI helped identify and fix issues in real-time during development.

### Example Prompts Used

- "Create a FastAPI backend with JWT authentication using cookies"
- "Implement daily budget calculation based on income, fixed expenses, and savings percentage"
- "Build a React component for displaying balance with Tailwind CSS styling"
- "Add automatic expense categorization based on keyword matching"

### Benefits of AI-Assisted Development

- Faster prototyping and iteration
- Consistent code style across the project
- Comprehensive error handling
- Well-documented code with type hints

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Frontend powered by [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- AI assistance by [Claude](https://anthropic.com/claude)
