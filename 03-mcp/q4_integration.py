from fastmcp import FastMCP
from utils.scraper import jina_reader

mcp = FastMCP("Web Scraper Server")


@mcp.tool
def scrape_url(url: str) -> str:
    """
    Scrape content from a URL using Jina reader.
    Returns the full text content.

    Args:
        url: The URL to scrape

    Returns:
        The text content of the page
    """
    return jina_reader(url)


@mcp.tool
def count_word(url: str, word: str) -> dict:
    """
    Count occurrences of a word in the content from a URL.
    Returns both count and total characters.

    Args:
        url: The URL to analyze
        word: The word to count (case-insensitive)

    Returns:
        Dictionary with count, url, word, and total characters
    """
    content = jina_reader(url)
    # Case-insensitive count
    count = content.lower().count(word.lower())
    return {
        "url": url,
        "word": word,
        "count": count,
        "total_chars": len(content),
    }


if __name__ == "__main__":
    # Test query for homework
    print("Testing word count on datatalks.club...")

    # Call directly for testing
    url = "https://datatalks.club/"
    word = "data"
    content = jina_reader(url)
    count = content.lower().count(word.lower())
    total_chars = len(content)

    print(f"\n{'='*60}")
    print(f"ANSWER FOR QUESTION 4:")
    print(f"Occurrences of '{word}' on {url}: {count}")
    print(f"Total characters: {total_chars}")
    print(f"Options: 61, 111, 161, 261")
    print(f"{'='*60}")

    # To run as MCP server, uncomment the line below:
    # mcp.run()
