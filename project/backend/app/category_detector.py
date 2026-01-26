DEFAULT_CATEGORIES = {
    "Продукты": ["продукты", "булки", "фрукты", "молоко", "хлеб", "мясо", "овощи", "магазин", "пятерочка", "перекресток", "магнит", "ашан", "лента"],
    "Доставка еды": ["доставка", "додо", "пицца", "роллы", "шава", "шаурма", "бургер", "суши", "яндекс еда", "деливери", "самокат"],
    "Такси": ["такси", "яндекс такси", "убер", "uber", "ситимобил", "bolt"],
    "Подписки": ["подписка", "spotify", "icloud", "netflix", "youtube", "premium", "plus", "apple music", "кинопоиск"],
    "Аптека": ["аптека", "таблетки", "лекарства", "витамины", "медикаменты"],
    "Развлечения": ["кино", "кафе", "кальян", "игра", "стим", "steam", "бар", "ресторан", "клуб", "концерт", "театр", "музей"],
    "Одежда": ["одежда", "платье", "лифчик", "трусы", "футболка", "джинсы", "куртка", "обувь", "кроссовки", "zara", "hm", "uniqlo"],
    "Собаки": ["корм", "бравекто", "вкусни", "собак", "ветеринар", "поводок", "ошейник"],
    "Транспорт": ["метро", "автобус", "троллейбус", "трамвай", "электричка", "поезд", "билет"],
    "Связь": ["мобильный", "телефон", "интернет", "мегафон", "мтс", "билайн", "теле2"],
}


def detect_category(description: str, custom_categories: dict = None) -> str:
    categories = custom_categories if custom_categories else DEFAULT_CATEGORIES
    description_lower = description.lower()

    for category, keywords in categories.items():
        for keyword in keywords:
            if keyword in description_lower:
                return category

    return "Прочее"


def get_categories_from_db(db_categories) -> dict:
    result = {}
    for cat in db_categories:
        keywords = [k.strip() for k in cat.keywords.split(",")]
        result[cat.name] = keywords
    return result
