from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from pydantic import BaseModel
from ..database import get_db
from ..models import Category, User
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])


class CategoryCreate(BaseModel):
    name: str
    keywords: str


class CategoryUpdate(BaseModel):
    name: str | None = None
    keywords: str | None = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    keywords: str
    is_default: bool

    class Config:
        from_attributes = True


@router.get("/categories", response_model=List[CategoryResponse])
def get_user_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    categories = db.query(Category).filter(
        or_(Category.user_id == current_user.id, Category.user_id == None)
    ).all()

    return [
        CategoryResponse(
            id=cat.id,
            name=cat.name,
            keywords=cat.keywords,
            is_default=cat.user_id is None
        )
        for cat in categories
    ]


@router.post("/categories", response_model=CategoryResponse)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Category).filter(
        Category.name == category.name,
        or_(Category.user_id == current_user.id, Category.user_id == None)
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )

    db_category = Category(
        name=category.name,
        keywords=category.keywords,
        user_id=current_user.id
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    return CategoryResponse(
        id=db_category.id,
        name=db_category.name,
        keywords=db_category.keywords,
        is_default=False
    )


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()

    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found or you don't have permission to edit it"
        )

    if category.name is not None:
        db_category.name = category.name
    if category.keywords is not None:
        db_category.keywords = category.keywords

    db.commit()
    db.refresh(db_category)

    return CategoryResponse(
        id=db_category.id,
        name=db_category.name,
        keywords=db_category.keywords,
        is_default=False
    )


@router.delete("/categories/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()

    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found or you don't have permission to delete it"
        )

    db.delete(db_category)
    db.commit()

    return {"message": "Category deleted successfully"}
