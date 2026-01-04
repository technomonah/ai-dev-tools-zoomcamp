from utils.scraper import jina_reader

if __name__ == "__main__":
    url = "https://github.com/alexeygrigorev/minsearch"
    print(f"Fetching content from {url}...")

    content = jina_reader(url)

    char_count = len(content)
    print(f"\nContent retrieved: {char_count} characters")
    print(f"\nContent preview (first 500 chars):\n{content[:500]}...")

    # Determine closest answer from options
    options = [1184, 9184, 19184, 29184]
    closest = min(options, key=lambda x: abs(x - char_count))

    print(f"\n{'='*60}")
    print(f"ANSWER FOR QUESTION 3:")
    print(f"Actual character count: {char_count}")
    print(f"Closest option: {closest}")
    print(f"{'='*60}")
