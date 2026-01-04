# AI Dev Tools Zoomcamp - Homework 03: MCP Module

A FastMCP server implementation with web scraping and documentation search capabilities, built for the AI Dev Tools Zoomcamp course.

## Features

- **Web Scraping**: Extract content from any URL using Jina Reader API
- **Word Counting**: Count word occurrences in web pages
- **Documentation Search**: Search FastMCP documentation using minsearch
- **MCP Integration**: All features available as MCP tools for AI assistants

## Prerequisites

- Python 3.9 or higher
- UV package manager

## Setup

### 1. Install UV Package Manager

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or via Homebrew
brew install uv
```

### 2. Clone and Navigate

```bash
cd ai-dev-tools-zoomcamp/03-mcp
```

### 3. Install Dependencies

Dependencies are already configured in `pyproject.toml`. UV will automatically install them when running scripts:

```bash
# Dependencies will be installed automatically with:
uv run <script_name>.py
```

## Project Structure

```
03-mcp/
├── main.py                 # Final integrated MCP server (Q6)
├── q2_transport.py         # Transport mechanism demo (Q2)
├── q3_scraper.py          # Web scraping test (Q3)
├── q4_integration.py      # Tool integration demo (Q4)
├── q5_search.py           # Search implementation (Q5)
├── utils/
│   ├── __init__.py
│   ├── scraper.py         # Jina reader utilities
│   ├── search.py          # Minsearch integration
│   └── download.py        # FastMCP repo downloader
├── data/                  # Downloaded data (gitignored)
├── README.md              # This file
├── homework.md            # Homework answers
├── pyproject.toml         # UV project config
└── .gitignore            # Version control ignores
```

## Running Individual Questions

### Question 1: Project Setup

```bash
# Already completed - check uv.lock for fastmcp hash
cat uv.lock | grep -A 5 "name = \"fastmcp\""
```

### Question 2: Transport Mechanism

```bash
uv run q2_transport.py
# Expected output: Server runs with STDIO transport
```

### Question 3: Web Scraping

```bash
uv run q3_scraper.py
# Scrapes minsearch GitHub repo and counts characters
```

### Question 4: Tool Integration

```bash
uv run q4_integration.py
# Counts occurrences of "data" on datatalks.club
```

### Question 5: Search Implementation

```bash
uv run q5_search.py
# Downloads fastmcp repo, indexes docs, searches for "demo"
```

### Question 6: Main MCP Server

```bash
uv run main.py
# Starts integrated MCP server with all tools
```

## MCP Server Tools

The main MCP server (`main.py`) provides three tools:

### 1. scrape_url

Scrape content from any URL using Jina Reader.

```python
# Example usage
scrape_url("https://example.com")
```

### 2. count_word_in_url

Count occurrences of a word in a URL's content.

```python
# Example usage
count_word_in_url("https://datatalks.club/", "data")
# Returns: {"url": "...", "word": "data", "count": 61, "total_chars": 5679}
```

### 3. search_fastmcp_docs

Search FastMCP documentation.

```python
# Example usage
search_fastmcp_docs("demo", num_results=5)
# Returns: List of top 5 matching documents with paths and previews
```

## Configuring in Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "fastmcp-docs": {
      "command": "uv",
      "args": [
        "run",
        "/Users/nikitamanakov/ai-dev-tools-zoomcamp/03-mcp/main.py"
      ]
    }
  }
}
```

## Technologies Used

- **FastMCP**: Python framework for building MCP servers
- **Jina Reader**: Web content extraction API
- **Minsearch**: Lightweight text search engine
- **UV**: Fast Python package manager

## Homework Answers

All homework questions and answers are documented in [homework.md](./homework.md).

## Resources

- [FastMCP Documentation](https://gofastmcp.com)
- [Jina Reader API](https://jina.ai/reader/)
- [Minsearch GitHub](https://github.com/alexeygrigorev/minsearch)
- [UV Documentation](https://docs.astral.sh/uv/)
- [Model Context Protocol](https://modelcontextprotocol.io)

## License

This project is part of the AI Dev Tools Zoomcamp course materials.
