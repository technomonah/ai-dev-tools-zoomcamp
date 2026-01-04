from fastmcp import FastMCP
from utils.scraper import jina_reader
from utils.download import download_fastmcp_repo
from utils.search import (
    process_markdown_files,
    create_search_index,
    search_documents,
)
from pathlib import Path

# Initialize MCP server
mcp = FastMCP("FastMCP Documentation Server")

# Global search index (lazy initialization)
_search_index = None


def get_search_index():
    """Lazy load search index"""
    global _search_index
    if _search_index is None:
        print("Initializing search index...")
        repo_path = Path("data/fastmcp-main")

        # Download if not exists
        if not repo_path.exists():
            repo_path = download_fastmcp_repo()

        documents = process_markdown_files(str(repo_path))
        _search_index = create_search_index(documents)
        print(f"Index initialized with {len(documents)} documents")

    return _search_index


@mcp.tool
def scrape_url(url: str) -> str:
    """
    Scrape content from a URL using Jina reader service.
    Prepends r.jina.ai/ to the URL for conversion.

    Args:
        url: The URL to scrape

    Returns:
        The text content of the page
    """
    return jina_reader(url)


@mcp.tool
def count_word_in_url(url: str, word: str) -> dict:
    """
    Count occurrences of a word in content from a URL.

    Args:
        url: The URL to analyze
        word: The word to count (case-insensitive)

    Returns:
        Dictionary with count, url, word, and total characters
    """
    content = jina_reader(url)
    count = content.lower().count(word.lower())
    return {"url": url, "word": word, "count": count, "total_chars": len(content)}


@mcp.tool
def search_fastmcp_docs(query: str, num_results: int = 5) -> list:
    """
    Search FastMCP documentation for relevant information.

    Args:
        query: Search query
        num_results: Number of results to return (default: 5)

    Returns:
        List of matching documents with path and content
    """
    index = get_search_index()
    results = search_documents(index, query, num_results)

    # Format results for better readability
    formatted_results = []
    for i, result in enumerate(results, 1):
        formatted_results.append(
            {
                "rank": i,
                "path": result["path"],
                "filename": result["filename"],
                "content_preview": result["content"][:500],
            }
        )

    return formatted_results


if __name__ == "__main__":
    # Pre-initialize index (optional)
    # get_search_index()

    # Run MCP server
    mcp.run()
