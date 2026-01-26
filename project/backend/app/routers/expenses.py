from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db
from ..models import User, Income, FixedExpense, DailyExpense
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/api", tags=["expenses"])


def check_income_ownership(db: Session, income_id: int, user_id: int) -> Income:
    income = db.query(Income).filter(Income.id == income_id).first()
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    if income.month.user_id != user_id:
        raise HTTPException(status_code=404, detail="Income not found")
    return income


def check_fixed_expense_ownership(db: Session, expense_id: int, user_id: int) -> FixedExpense:
    expense = db.query(FixedExpense).filter(FixedExpense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Fixed expense not found")
    if expense.month.user_id != user_id:
        raise HTTPException(status_code=404, detail="Fixed expense not found")
    return expense


def check_daily_expense_ownership(db: Session, expense_id: int, user_id: int) -> DailyExpense:
    expense = db.query(DailyExpense).filter(DailyExpense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Daily expense not found")
    if expense.month.user_id != user_id:
        raise HTTPException(status_code=404, detail="Daily expense not found")
    return expense


@router.put("/incomes/{income_id}", response_model=schemas.Income)
def update_income(
    income_id: int,
    income: schemas.IncomeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_income_ownership(db, income_id, current_user.id)
    db_income = crud.update_income(db, income_id, income)
    if not db_income:
        raise HTTPException(status_code=404, detail="Income not found")
    return db_income


@router.delete("/incomes/{income_id}")
def delete_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_income_ownership(db, income_id, current_user.id)
    if not crud.delete_income(db, income_id):
        raise HTTPException(status_code=404, detail="Income not found")
    return {"message": "Income deleted"}


@router.put("/fixed-expenses/{expense_id}", response_model=schemas.FixedExpense)
def update_fixed_expense(
    expense_id: int,
    expense: schemas.FixedExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_fixed_expense_ownership(db, expense_id, current_user.id)
    db_expense = crud.update_fixed_expense(db, expense_id, expense)
    if not db_expense:
        raise HTTPException(status_code=404, detail="Fixed expense not found")
    return db_expense


@router.delete("/fixed-expenses/{expense_id}")
def delete_fixed_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_fixed_expense_ownership(db, expense_id, current_user.id)
    if not crud.delete_fixed_expense(db, expense_id):
        raise HTTPException(status_code=404, detail="Fixed expense not found")
    return {"message": "Fixed expense deleted"}


@router.put("/daily-expenses/{expense_id}", response_model=schemas.DailyExpense)
def update_daily_expense(
    expense_id: int,
    expense: schemas.DailyExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_daily_expense_ownership(db, expense_id, current_user.id)
    db_expense = crud.update_daily_expense(db, expense_id, expense)
    if not db_expense:
        raise HTTPException(status_code=404, detail="Daily expense not found")
    return db_expense


@router.delete("/daily-expenses/{expense_id}")
def delete_daily_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_daily_expense_ownership(db, expense_id, current_user.id)
    if not crud.delete_daily_expense(db, expense_id):
        raise HTTPException(status_code=404, detail="Daily expense not found")
    return {"message": "Daily expense deleted"}
