from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from datetime import date
from calendar import monthrange
from typing import Optional
from . import models, schemas
from .category_detector import detect_category, get_categories_from_db, DEFAULT_CATEGORIES


def get_months(db: Session, user_id: int):
    return db.query(models.Month).filter(
        models.Month.user_id == user_id
    ).order_by(models.Month.year.desc(), models.Month.month.desc()).all()


def get_month(db: Session, month_id: int, user_id: Optional[int] = None):
    query = db.query(models.Month).filter(models.Month.id == month_id)
    if user_id is not None:
        query = query.filter(models.Month.user_id == user_id)
    return query.first()


def get_month_by_date(db: Session, year: int, month: int, user_id: int):
    return db.query(models.Month).filter(
        models.Month.year == year,
        models.Month.month == month,
        models.Month.user_id == user_id
    ).first()


def create_month(db: Session, month: schemas.MonthCreate, user_id: int):
    existing = get_month_by_date(db, month.year, month.month, user_id)
    if existing:
        return existing

    db_month = models.Month(**month.model_dump(), user_id=user_id)
    db.add(db_month)
    db.commit()
    db.refresh(db_month)
    return db_month


def update_month(db: Session, month_id: int, month: schemas.MonthUpdate, user_id: Optional[int] = None):
    db_month = get_month(db, month_id, user_id)
    if not db_month:
        return None

    update_data = month.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_month, key, value)

    db.commit()
    db.refresh(db_month)
    return db_month


def get_incomes(db: Session, month_id: int):
    return db.query(models.Income).filter(models.Income.month_id == month_id).all()


def create_income(db: Session, month_id: int, income: schemas.IncomeCreate):
    db_income = models.Income(**income.model_dump(), month_id=month_id)
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income


def update_income(db: Session, income_id: int, income: schemas.IncomeUpdate):
    db_income = db.query(models.Income).filter(models.Income.id == income_id).first()
    if not db_income:
        return None

    update_data = income.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_income, key, value)

    db.commit()
    db.refresh(db_income)
    return db_income


def delete_income(db: Session, income_id: int):
    db_income = db.query(models.Income).filter(models.Income.id == income_id).first()
    if db_income:
        db.delete(db_income)
        db.commit()
        return True
    return False


def get_fixed_expenses(db: Session, month_id: int):
    return db.query(models.FixedExpense).filter(models.FixedExpense.month_id == month_id).all()


def create_fixed_expense(db: Session, month_id: int, expense: schemas.FixedExpenseCreate):
    db_expense = models.FixedExpense(**expense.model_dump(), month_id=month_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def update_fixed_expense(db: Session, expense_id: int, expense: schemas.FixedExpenseUpdate):
    db_expense = db.query(models.FixedExpense).filter(models.FixedExpense.id == expense_id).first()
    if not db_expense:
        return None

    update_data = expense.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_expense, key, value)

    db.commit()
    db.refresh(db_expense)
    return db_expense


def delete_fixed_expense(db: Session, expense_id: int):
    db_expense = db.query(models.FixedExpense).filter(models.FixedExpense.id == expense_id).first()
    if db_expense:
        db.delete(db_expense)
        db.commit()
        return True
    return False


def get_daily_expenses(db: Session, month_id: int):
    return db.query(models.DailyExpense).filter(
        models.DailyExpense.month_id == month_id
    ).order_by(models.DailyExpense.date).all()


def create_daily_expense(db: Session, month_id: int, expense: schemas.DailyExpenseCreate, user_id: Optional[int] = None):
    db_categories = db.query(models.Category).filter(
        or_(models.Category.user_id == user_id, models.Category.user_id == None)
    ).all() if user_id else db.query(models.Category).filter(models.Category.user_id == None).all()

    categories = get_categories_from_db(db_categories) if db_categories else DEFAULT_CATEGORIES

    category = expense.category
    if not category or category == "Прочее":
        category = detect_category(expense.description, categories)

    db_expense = models.DailyExpense(
        month_id=month_id,
        date=expense.date,
        description=expense.description,
        amount=expense.amount,
        category=category
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def update_daily_expense(db: Session, expense_id: int, expense: schemas.DailyExpenseUpdate):
    db_expense = db.query(models.DailyExpense).filter(models.DailyExpense.id == expense_id).first()
    if not db_expense:
        return None

    update_data = expense.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_expense, key, value)

    db.commit()
    db.refresh(db_expense)
    return db_expense


def delete_daily_expense(db: Session, expense_id: int):
    db_expense = db.query(models.DailyExpense).filter(models.DailyExpense.id == expense_id).first()
    if db_expense:
        db.delete(db_expense)
        db.commit()
        return True
    return False


def calculate_balance(db: Session, month_id: int):
    month = db.query(models.Month).filter(models.Month.id == month_id).first()
    if not month:
        return None

    total_income = sum(i.amount for i in month.incomes)
    total_fixed = sum(e.amount for e in month.fixed_expenses)
    savings_amount = total_income * (month.savings_percent / 100)
    available_budget = total_income - total_fixed - savings_amount

    days_in_month = monthrange(month.year, month.month)[1]
    daily_budget = available_budget / days_in_month if days_in_month > 0 else 0

    today = date.today()
    if today.year == month.year and today.month == month.month:
        current_day = today.day
    elif (today.year > month.year) or (today.year == month.year and today.month > month.month):
        current_day = days_in_month
    else:
        current_day = 0

    daily_expenses = sorted(month.daily_expenses, key=lambda x: x.date)

    daily_balances = []
    cumulative_spent = 0

    for day in range(1, days_in_month + 1):
        day_date = date(month.year, month.month, day)
        day_expenses = sum(e.amount for e in daily_expenses if e.date == day_date)
        cumulative_spent += day_expenses
        expected_spent = daily_budget * day
        balance = expected_spent - cumulative_spent

        daily_balances.append({
            "day": day,
            "date": day_date.isoformat(),
            "spent": day_expenses,
            "cumulative_spent": cumulative_spent,
            "expected_spent": expected_spent,
            "balance": balance
        })

    actual_spent = sum(e.amount for e in daily_expenses)
    expected_spent = daily_budget * current_day
    balance = expected_spent - actual_spent

    return {
        "total_income": total_income,
        "total_fixed_expenses": total_fixed,
        "savings_amount": savings_amount,
        "available_budget": available_budget,
        "days_in_month": days_in_month,
        "daily_budget": daily_budget,
        "current_day": current_day,
        "expected_spent": expected_spent,
        "actual_spent": actual_spent,
        "balance": balance,
        "daily_balances": daily_balances
    }


def get_analytics(db: Session, month_id: int):
    expenses = get_daily_expenses(db, month_id)

    category_totals = {}
    for expense in expenses:
        if expense.category not in category_totals:
            category_totals[expense.category] = 0
        category_totals[expense.category] += expense.amount

    total = sum(category_totals.values())

    categories = [
        {
            "name": name,
            "amount": amount,
            "percentage": (amount / total * 100) if total > 0 else 0
        }
        for name, amount in sorted(category_totals.items(), key=lambda x: -x[1])
    ]

    return {
        "categories": categories,
        "total": total
    }


def get_categories(db: Session, user_id: Optional[int] = None):
    if user_id:
        return db.query(models.Category).filter(
            or_(models.Category.user_id == user_id, models.Category.user_id == None)
        ).all()
    return db.query(models.Category).filter(models.Category.user_id == None).all()


def create_default_categories(db: Session):
    existing = db.query(models.Category).filter(models.Category.user_id == None).first()
    if existing:
        return

    for name, keywords in DEFAULT_CATEGORIES.items():
        db_category = models.Category(name=name, keywords=", ".join(keywords), user_id=None)
        db.add(db_category)

    db.commit()
