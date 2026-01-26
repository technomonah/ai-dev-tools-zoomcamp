from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .routers import months, expenses, categories, profile
from .auth import router as auth_router
from . import crud

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Leprecoin API", description="API для учёта личных финансов")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(months.router)
app.include_router(expenses.router)
app.include_router(categories.router)
app.include_router(profile.router)


@app.on_event("startup")
def startup():
    db = SessionLocal()
    try:
        crud.create_default_categories(db)
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Leprecoin API", "docs": "/docs"}


@app.get("/health")
def health_check():
    """Health check endpoint for monitoring and container orchestration."""
    return {"status": "healthy", "service": "leprecoin-api"}


@app.get("/openapi.json", include_in_schema=False)
def get_openapi_spec():
    """Export OpenAPI specification."""
    return app.openapi()
