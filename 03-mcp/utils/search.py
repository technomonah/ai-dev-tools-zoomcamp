from pathlib import Path
from minsearch import Index


def normalize_path(path: Path, root: Path) -> str:
    """
    Remove root directory prefix from path.

    Args:
        path: Full file path
        root: Root directory to remove

    Returns:
        Normalized relative path

    Example:
        data/fastmcp-main/docs/README.md -> docs/README.md
    """
    return str(path.relative_to(root))


def process_markdown_files(repo_path: str) -> list:
    """
    Process markdown and MDX files from repository.
    Returns list of documents with normalized paths.

    Args:
        repo_path: Path to the repository

    Returns:
        List of document dictionaries with path, content, and filename
    """
    root = Path(repo_path)
    documents = []

    # Find all .md and .mdx files
    for ext in ["*.md", "*.mdx"]:
        for file_path in root.rglob(ext):
            # Skip hidden directories and files
            if any(part.startswith(".") for part in file_path.parts):
                continue

            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                # Normalize path
                normalized_path = normalize_path(file_path, root)

                documents.append(
                    {
                        "path": normalized_path,
                        "content": content,
                        "filename": file_path.name,
                    }
                )
            except Exception as e:
                print(f"Error processing {file_path}: {e}")

    return documents


def create_search_index(documents: list) -> Index:
    """
    Create minsearch index from documents.

    Args:
        documents: List of document dictionaries

    Returns:
        Minsearch Index object
    """
    index = Index(text_fields=["content", "filename", "path"], keyword_fields=[])
    index.fit(documents)
    return index


def search_documents(index: Index, query: str, num_results: int = 5) -> list:
    """
    Search for documents matching query.

    Args:
        index: Minsearch index
        query: Search query
        num_results: Number of results to return (default: 5)

    Returns:
        List of top matching documents
    """
    results = index.search(query, num_results=num_results)
    return results
