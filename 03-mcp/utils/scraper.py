import requests


def jina_reader(url: str) -> str:
    """
    Fetch content from URL using Jina reader service.
    Prepends r.jina.ai/ to the URL to convert HTML to markdown.

    Args:
        url: The URL to scrape

    Returns:
        The text content from the URL
    """
    jina_url = f"https://r.jina.ai/{url}"
    response = requests.get(jina_url)
    response.raise_for_status()
    return response.text
