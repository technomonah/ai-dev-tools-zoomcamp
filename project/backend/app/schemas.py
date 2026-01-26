from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class IncomeBase(BaseModel):
    name: str
    amount: float


class IncomeCreate(IncomeBase):
    pass


class IncomeUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None


class Income(IncomeBase):
    id: int
    month_id: int

    class Config:
        from_attributes = True


class FixedExpenseBase(BaseModel):
    name: str
    amount: float


class FixedExpenseCreate(FixedExpenseBase):
    pass


class FixedExpenseUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None


class FixedExpense(FixedExpenseBase):
    id: int
    month_id: int

    class Config:
        from_attributes = True


class DailyExpenseBase(BaseModel):
    date: date
    description: str
    amount: float
    category: Optional[str] = "Прочее"


class DailyExpenseCreate(DailyExpenseBase):
    pass


class DailyExpenseUpdate(BaseModel):
    date: Optional[date] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None


class DailyExpense(DailyExpenseBase):
    id: int
    month_id: int

    class Config:
        from_attributes = True


class MonthBase(BaseModel):
    year: int
    month: int
    savings_percent: Optional[float] = 0


class MonthCreate(MonthBase):
    pass


class MonthUpdate(BaseModel):
    savings_percent: Optional[float] = None


class Month(MonthBase):
    id: int
    created_at: datetime
    incomes: list[Income] = []
    fixed_expenses: list[FixedExpense] = []
    daily_expenses: list[DailyExpense] = []

    class Config:
        from_attributes = True


class MonthSummary(BaseModel):
    id: int
    year: int
    month: int
    savings_percent: float

    class Config:
        from_attributes = True


class BalanceResponse(BaseModel):
    total_income: float
    total_fixed_expenses: float
    savings_amount: float
    available_budget: float
    days_in_month: int
    daily_budget: float
    current_day: int
    expected_spent: float
    actual_spent: float
    balance: float
    daily_balances: list[dict]


class CategoryBase(BaseModel):
    name: str
    keywords: str


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class DetectCategoryRequest(BaseModel):
    description: str


class DetectCategoryResponse(BaseModel):
    category: str


class AnalyticsResponse(BaseModel):
    categories: list[dict]
    total: float
