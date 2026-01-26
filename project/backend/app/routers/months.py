from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, crud
from ..database import get_db
from ..models import User
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/api/months", tags=["months"])


@router.get("", response_model=List[schemas.MonthSummary])
def get_months(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_months(db, current_user.id)


@router.post("", response_model=schemas.MonthSummary)
def create_month(
    month: schemas.MonthCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.create_month(db, month, current_user.id)


@router.get("/{month_id}", response_model=schemas.Month)
def get_month(
    month_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_month = crud.get_month(db, month_id, current_user.id)
    if not db_month:
        raise HTTPException(status_code=404, detail="Month not found")
    return db_month


@router.put("/{month_id}", response_model=schemas.MonthSummary)
def update_month(
    month_id: int,
    month: schemas.MonthUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_month = crud.update_month(db, month_id, month, current_user.id)
    if not db_month:
        raise HTTPException(status_code=404, detail="Month not found")
    return db_month


@router.get("/{month_id}/incomes", response_model=List[schemas.Income])
def get_incomes(
    month_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not crud.get_month(db, month_id, current_user.id):
        raise HTTPException(status_code=404, detail="Month not found")
    return crud.get_incomes(db, month_id)


@router.post("/{month_id}/incomes", response_model=schemas.Income)
def create_income(
    month_id: int,
    income: schemas.IncomeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not crud.get_month(db, month_id, current_user.id):
        raise HTTPException(status_code=404, detail="Month not found")
    return crud.create_income(db, month_id, income)


@router.get("/{month_id}/fixed-expenses", response_model=List[schemas.FixedExpense])
def get_fixed_expenses(
    month_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not crud.get_month(db, month_id, current_user.id):
        raise HTTPException(status_code=404, detail="Month not found")
    return crud.get_fixed_expenses(db, month_id)


@router.post("/{month_id}/fixed-expenses", response_model=schemas.FixedExpense)
def create_fixed_expense(
    month_id: int,
    expense: schemas.FixedExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not crud.get_month(db, month_id, current_user.id):
        raise HTTPException(status_code=404, detail="Month not found")
    return crud.create_fixed_expense(db, month_id, expense)


@router.get("/{month_id}/daily-expenses", response_model=List[schemas.DailyExpense])
def get_daily_expenses(
    month_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not crud.get_month(db, month_id, current_user.id):
        raise HTTPException(status_code=404, detail="Month not found")
    return crud.get_daily_expenses(db, month_id)


@router.post("/{month_id}/daily-expenses", response_model=schemas.DailyExpense)
def create_daily_expense(
    month_id: int,
    expense: schemas.DailyExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not crud.get_month(db, month_id, current_user.id):
        raise HTTPException(status_code=404, detail="Month not found")
    return crud.create_daily_expense(db, month_id, expense, current_user.id)


@router.get("/{month_id}/balance", response_model=schemas.BalanceResponse)
def get_balance(
    month_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not crud.get_month(db, month_id, current_user.id):
        raise HTTPException(status_code=404, detail="Month not found")
    balance = crud.calculate_balance(db, month_id)
    if not balance:
        raise HTTPException(status_code=404, detail="Month not found")
    return balance


@router.get("/{month_id}/analytics", response_model=schemas.AnalyticsResponse)
def get_analytics(
    month_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not crud.get_month(db, month_id, current_user.id):
        raise HTTPException(status_code=404, detail="Month not found")
    return crud.get_analytics(db, month_id)
