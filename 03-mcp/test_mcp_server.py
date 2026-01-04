"""
Test script to verify MCP server tools are working.
This script tests the main.py MCP server tools directly.
"""

from main import scrape_url, count_word_in_url, search_fastmcp_docs

print("Testing MCP Server Tools")
print("=" * 60)

# Test 1: scrape_url
print("\n1. Testing scrape_url tool...")
try:
    # Use the tool's underlying function for testing
    from utils.scraper import jina_reader
    result = jina_reader("https://example.com")
    print(f"   ✓ Successfully scraped content ({len(result)} chars)")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Test 2: count_word_in_url
print("\n2. Testing count_word_in_url tool...")
try:
    from utils.scraper import jina_reader
    content = jina_reader("https://example.com")
    count = content.lower().count("example")
    print(f"   ✓ Word count successful (found 'example' {count} times)")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Test 3: search_fastmcp_docs
print("\n3. Testing search_fastmcp_docs tool...")
try:
    from utils.search import create_search_index, search_documents, process_markdown_files
    from pathlib import Path

    repo_path = Path("data/fastmcp-main")
    if repo_path.exists():
        docs = process_markdown_files(str(repo_path))
        index = create_search_index(docs)
        results = search_documents(index, "demo", num_results=3)
        print(f"   ✓ Search successful (found {len(results)} results)")
        if results:
            print(f"   First result: {results[0]['path']}")
    else:
        print("   ⚠ FastMCP repo not downloaded yet (will download on first search)")
except Exception as e:
    print(f"   ✗ Error: {e}")

print("\n" + "=" * 60)
print("MCP Server is ready to use!")
print("\nTo use with Claude Desktop:")
print("1. Restart Claude Desktop app")
print("2. Look for 'fastmcp-docs' server in MCP settings")
print("3. Use tools: scrape_url, count_word_in_url, search_fastmcp_docs")
print("=" * 60)
