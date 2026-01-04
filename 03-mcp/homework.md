# Homework 03: MCP Module

**Course**: AI Dev Tools Zoomcamp
**Module**: 03 - Model Context Protocol (MCP)
**Date**: January 4, 2026

---

## Question 1: Project Setup

**Task**: Initialize project with uv and find first hash in fastmcp wheels section of `uv.lock`

### Answer

```
sha256:e33cd622e1ebd5110af6a981804525b6cd41072e3c7d68268ed69ef3be651aca
```

### Steps Taken

1. Installed UV package manager:
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. Created project directory and initialized:
   ```bash
   mkdir 03-mcp && cd 03-mcp
   uv init
   ```

3. Added fastmcp dependency:
   ```bash
   uv add fastmcp
   ```

4. Examined `uv.lock` file and located the fastmcp package section (line 349)

5. Found the `wheels` section (line 371-373) and extracted the first hash value

### Code Reference

The hash can be found in `uv.lock:372` within the fastmcp package wheels section.

---

## Question 2: FastMCP Transport

**Task**: Identify transport mechanism used by FastMCP

### Answer

**STDIO** (Standard Input/Output)

### Explanation

FastMCP uses STDIO transport by default when calling `mcp.run()`. This is the standard Inter-Process Communication (IPC) mechanism for MCP servers, enabling local client-server communication through standard input and output streams.

STDIO is the default transport for MCP servers because it:
- Works reliably across different platforms
- Integrates seamlessly with process management
- Provides efficient bidirectional communication
- Is the standard defined by the MCP specification

### Code Implementation

See [q2_transport.py](./q2_transport.py:13)

---

## Question 3: Web Scraping Tool

**Task**: Create Jina reader tool and count characters from minsearch repository

### Answer

**29184** (closest option to actual count of 31,361 characters)

### Details

- **Actual character count**: 31,361
- **Available options**: 1184, 9184, 19184, 29184
- **Selected answer**: 29184

### Implementation

The Jina Reader API converts HTML pages to clean markdown by prepending `https://r.jina.ai/` to any URL. This makes web content LLM-friendly by removing navigation, ads, and other clutter.

**Test URL**: `https://github.com/alexeygrigorev/minsearch`

### Code Implementation

- Utility: [utils/scraper.py](./utils/scraper.py:5)
- Test script: [q3_scraper.py](./q3_scraper.py:6)

---

## Question 4: Tool Integration

**Task**: Count occurrences of "data" on datatalks.club

### Answer

**61**

### Details

- **URL**: https://datatalks.club/
- **Word**: "data" (case-insensitive)
- **Count**: 61 occurrences
- **Total characters**: 5,679
- **Available options**: 61, 111, 161, 261

### Implementation

Created an MCP server with two tools:
1. `scrape_url` - Scrapes content from any URL using Jina Reader
2. `count_word` - Counts word occurrences (case-insensitive)

The implementation performs a case-insensitive search by converting both the content and search term to lowercase before counting.

### Code Implementation

See [q4_integration.py](./q4_integration.py:22)

---

## Question 5: Search Implementation (2 points)

**Task**: Index FastMCP docs with minsearch and search for "demo"

### Answer

**examples/testing_demo/README.md**

### Implementation Details

#### Statistics
- **Total markdown files indexed**: 264
- **Search query**: "demo"
- **Results returned**: 5

#### Top 5 Results

1. **examples/testing_demo/README.md** ← Answer
2. examples/fastmcp_config_demo/README.md
3. examples/atproto_mcp/README.md
4. docs/servers/context.mdx
5. docs/getting-started/welcome.mdx

### Implementation Steps

1. **Download Repository**: Automated download of FastMCP repository from GitHub as ZIP file
2. **Extract Files**: Unzip to `data/fastmcp-main/` directory
3. **Process Markdown Files**:
   - Recursively search for `.md` and `.mdx` files
   - Skip hidden directories (starting with `.`)
   - Normalize paths (remove root directory prefix)
4. **Create Index**:
   - Used minsearch library
   - Text fields: `content`, `filename`, `path`
   - No keyword fields
5. **Search**: Query for "demo" with 5 results

### Path Normalization

Paths are normalized by removing the root directory prefix:
- Before: `data/fastmcp-main/examples/testing_demo/README.md`
- After: `examples/testing_demo/README.md`

This ensures clean, portable paths in search results.

### Code Implementation

- Download utility: [utils/download.py](./utils/download.py:7)
- Search utility: [utils/search.py](./utils/search.py:24)
- Test script: [q5_search.py](./q5_search.py:1)

---

## Question 6: Search Tool (Ungraded)

**Task**: Integrate search functionality as MCP tool in main.py

### Implementation

Created a comprehensive MCP server with three integrated tools:

#### 1. scrape_url(url: str) → str
- Scrapes web content using Jina Reader
- Converts HTML to clean markdown
- Returns full text content

#### 2. count_word_in_url(url: str, word: str) → dict
- Scrapes URL and counts word occurrences
- Case-insensitive matching
- Returns: `{url, word, count, total_chars}`

#### 3. search_fastmcp_docs(query: str, num_results: int = 5) → list
- Searches FastMCP documentation
- Lazy loads search index (downloads repo if needed)
- Returns formatted results with:
  - Rank
  - File path
  - Filename
  - Content preview (first 500 chars)

### Key Features

- **Lazy Initialization**: Search index is loaded only when first needed
- **Automatic Download**: Downloads FastMCP repo if not present
- **Persistent Index**: Once downloaded and indexed, reuses data directory
- **Clean Results**: Formatted for easy consumption by AI assistants

### Usage Example

```bash
# Start MCP server
uv run main.py

# Configure in Claude Desktop (see README.md)
# Then use tools through AI assistant:
# - "Search FastMCP docs for authentication"
# - "Count how many times 'tool' appears on example.com"
# - "Scrape the content from https://github.com/user/repo"
```

### Code Implementation

See [main.py](./main.py:1)

---

## Technologies and Key Learnings

### Technologies Used

1. **UV Package Manager** (v0.9.21)
   - Fast Python package and project manager
   - Rust-based, significantly faster than pip
   - Built-in virtual environment management
   - Lock file for reproducible builds

2. **FastMCP** (v2.14.2)
   - Python framework for building MCP servers
   - Decorator-based tool definition
   - STDIO transport by default
   - Type hints for automatic schema generation

3. **Jina Reader API**
   - Free web content extraction service
   - Converts HTML to clean markdown
   - URL format: `https://r.jina.ai/{original_url}`
   - No API key required for basic usage

4. **Minsearch** (v0.0.7)
   - Lightweight text search library
   - Built on sklearn and pandas
   - No external search engine required
   - Simple API: fit and search

### Key Learnings

1. **MCP Protocol**
   - Standardizes tool integration for AI assistants
   - STDIO enables efficient local IPC
   - Tool descriptions come from docstrings
   - Type hints define parameter schemas

2. **FastMCP Patterns**
   - Use `@mcp.tool` decorator for tools
   - Tools must be async-compatible
   - Server initialization is lightweight
   - `mcp.run()` blocks until shutdown

3. **Web Scraping for LLMs**
   - Jina Reader provides LLM-optimized content
   - Removes navigation, ads, formatting
   - Markdown is easier to process than HTML
   - Reduces token usage significantly

4. **Search Implementation**
   - Path normalization ensures portability
   - Lazy loading improves startup time
   - Text fields enable full-text search
   - Preview length balances context and size

5. **Project Organization**
   - Separate utilities from question scripts
   - Progressive implementation (Q2→Q3→Q4→Q5→Q6)
   - Each question builds on previous work
   - Final integration in main.py

---

## Challenges and Solutions

### Challenge 1: Tool Decoration Side Effects

**Problem**: MCP `@mcp.tool` decorator wraps functions, making them not directly callable in test code.

**Solution**: In test scripts (q4_integration.py), call the underlying function logic directly instead of the decorated tool.

### Challenge 2: Large Repository Download

**Problem**: FastMCP repository is 8.7MB, takes time to download and process.

**Solution**:
- Cache in `data/` directory
- Add to `.gitignore`
- Lazy load only when search is first called
- Reuse index across server restarts

### Challenge 3: Path Normalization

**Problem**: Search results contained full system paths like `data/fastmcp-main/examples/...`

**Solution**: Use `Path.relative_to()` to normalize paths by removing root directory prefix.

---

## Project Statistics

- **Total Files Created**: 13
- **Lines of Code**: ~400 (excluding downloads)
- **Dependencies**: 88 packages (including transitive)
- **Documentation Indexed**: 264 markdown files
- **Tools Implemented**: 3

---

## Submission

- **Repository**: https://github.com/[username]/ai-dev-tools-zoomcamp
- **Homework Directory**: `03-mcp/`
- **Submission URL**: https://courses.datatalks.club/ai-dev-tools-2025/homework/hw3

---

## Resources

- [AI Dev Tools Zoomcamp](https://github.com/DataTalksClub/ai-dev-tools-zoomcamp)
- [FastMCP Documentation](https://gofastmcp.com)
- [FastMCP GitHub](https://github.com/jlowin/fastmcp)
- [Jina Reader](https://jina.ai/reader/)
- [Minsearch](https://github.com/alexeygrigorev/minsearch)
- [UV Package Manager](https://docs.astral.sh/uv/)
- [Model Context Protocol](https://modelcontextprotocol.io)
