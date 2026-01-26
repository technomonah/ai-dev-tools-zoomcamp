from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from .. import schemas, crud
from ..database import get_db
from ..models import User, Category
from ..category_detector import detect_category, get_categories_from_db, DEFAULT_CATEGORIES
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/api", tags=["categories"])


def get_current_user_optional(request) -> Optional[User]:
    from fastapi import Request
    try:
        from ..auth.dependencies import get_current_user as _get_user
        return None
    except:
        return None


@router.get("/categories", response_model=List[schemas.Category])
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Category).filter(
        or_(Category.user_id == current_user.id, Category.user_id == None)
    ).all()


@router.post("/detect-category", response_model=schemas.DetectCategoryResponse)
def detect_category_endpoint(
    request: schemas.DetectCategoryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_categories = db.query(Category).filter(
        or_(Category.user_id == current_user.id, Category.user_id == None)
    ).all()
    categories = get_categories_from_db(db_categories) if db_categories else DEFAULT_CATEGORIES
    category = detect_category(request.description, categories)
    return {"category": category}
