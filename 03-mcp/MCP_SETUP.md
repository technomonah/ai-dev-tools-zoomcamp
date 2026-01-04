# MCP Server Setup and Usage Guide for Claude Code

## Configuration Complete ✓

Your MCP server has been configured and is ready to use with Claude Code!

### Configuration File Location
```
~/.claude.json (local scope, private to this project)
```

### Server Configuration

The MCP server is configured using Claude Code's MCP management commands:

```bash
# Create wrapper script
cat > /tmp/mcp_wrapper.sh << 'EOF'
#!/bin/bash
cd /Users/nikitamanakov/ai-dev-tools-zoomcamp/03-mcp
exec /Users/nikitamanakov/.local/bin/uv run main.py
EOF
chmod +x /tmp/mcp_wrapper.sh

# Add MCP server to Claude Code
claude mcp add --transport stdio fastmcp-docs --scope local -- /tmp/mcp_wrapper.sh
```

**Why the wrapper script?**
The server needs to run from its project directory to find the `utils` modules. The wrapper script ensures the correct working directory.

### Verify Configuration

Check MCP server status:
```bash
claude mcp list
# Should show: fastmcp-docs - ✓ Connected

# Get detailed info
claude mcp get fastmcp-docs
```

## Available Tools

### 1. scrape_url
**Description**: Scrape content from any URL using Jina Reader

**Parameters**:
- `url` (string): The URL to scrape

**Returns**: String with the page content converted to markdown

**Claude Code usage**:
```
Ask Claude: "Use scrape_url to get content from https://github.com/alexeygrigorev/minsearch"
```

**Tool name**: `mcp__fastmcp-docs__scrape_url`

---

### 2. count_word_in_url
**Description**: Count occurrences of a word in a URL's content

**Parameters**:
- `url` (string): The URL to analyze
- `word` (string): The word to count (case-insensitive)

**Returns**:
```json
{
  "url": "https://datatalks.club/",
  "word": "data",
  "count": 61,
  "total_chars": 5679
}
```

**Claude Code usage**:
```
Ask Claude: "Use count_word_in_url to count 'data' on https://datatalks.club/"
```

**Tool name**: `mcp__fastmcp-docs__count_word_in_url`

---

### 3. search_fastmcp_docs
**Description**: Search FastMCP documentation (264 indexed files)

**Parameters**:
- `query` (string): Search query
- `num_results` (int, optional): Number of results (default: 5)

**Returns**: List of matching documents with rank, path, filename, and content preview

**Claude Code usage**:
```
Ask Claude: "Use search_fastmcp_docs to find information about 'demo'"
```

**Tool name**: `mcp__fastmcp-docs__search_fastmcp_docs`

---

## Using the MCP Server in Claude Code

### Check Server Status

Run in your terminal:
```bash
/mcp
```

This shows:
- Connected MCP servers
- Available tools
- Server health status

### Use the Tools

Once the server is connected, you can ask Claude Code to use the tools:

**Examples**:
- "Search the FastMCP documentation for 'testing'"
- "Scrape https://example.com and summarize it"
- "Count how many times 'python' appears on python.org"

Claude will automatically invoke the MCP tools when appropriate.

### Direct Testing (Without Claude)

Test all tools directly:
```bash
cd /Users/nikitamanakov/ai-dev-tools-zoomcamp/03-mcp
uv run test_mcp_server.py
```

Run individual question scripts:
```bash
uv run q3_scraper.py      # Test web scraping
uv run q4_integration.py  # Test word counting
uv run q5_search.py       # Test documentation search
```

Run the server manually:
```bash
uv run main.py
# Server starts and waits for MCP protocol messages
# Press Ctrl+C to stop
```

## Troubleshooting

### Server Shows "Failed to connect"

**Problem**: Server can't start or find modules

**Solution**:
1. Ensure wrapper script exists and is executable:
   ```bash
   ls -la /tmp/mcp_wrapper.sh
   chmod +x /tmp/mcp_wrapper.sh
   ```

2. Test the wrapper script directly:
   ```bash
   /tmp/mcp_wrapper.sh
   # Should show FastMCP startup banner
   ```

3. Verify UV path:
   ```bash
   which uv
   # Should output: /Users/nikitamanakov/.local/bin/uv
   ```

4. Recreate the server config:
   ```bash
   claude mcp remove fastmcp-docs
   claude mcp add --transport stdio fastmcp-docs --scope local -- /tmp/mcp_wrapper.sh
   ```

### Tools Not Available

**Problem**: Server connected but tools don't appear

**Solution**:
1. Exit and restart your Claude Code session:
   ```bash
   /exit
   # Start a new conversation
   ```

2. Check server status:
   ```bash
   /mcp
   ```

3. Verify tools are registered by running:
   ```bash
   claude mcp get fastmcp-docs
   ```

### Search Tool Returns No Results

**Problem**: Search index not initialized

**Solution**: Run the search script once to download and index the repository:
```bash
cd /Users/nikitamanakov/ai-dev-tools-zoomcamp/03-mcp
uv run q5_search.py
```

This downloads the FastMCP repository and creates the search index in `data/fastmcp-main/`.

### "Connection Closed" Errors

**Problem**: Server crashes or exits unexpectedly

**Solution**:
1. Check the server runs successfully from project directory:
   ```bash
   cd /Users/nikitamanakov/ai-dev-tools-zoomcamp/03-mcp
   uv run main.py
   # Should show FastMCP banner
   ```

2. Check for Python errors:
   ```bash
   uv run test_mcp_server.py
   # All tests should pass
   ```

## Management Commands

### Add Server
```bash
claude mcp add --transport stdio fastmcp-docs --scope local -- /tmp/mcp_wrapper.sh
```

### Remove Server
```bash
claude mcp remove fastmcp-docs
```

### List Servers
```bash
claude mcp list
```

### Get Server Details
```bash
claude mcp get fastmcp-docs
```

## Configuration Scopes

- **Local scope** (default): Private to you in this project (`~/.claude.json`)
- **Project scope**: Shared with team (`.mcp.json` in repo root)
- **User scope**: Available across all your projects

We use **local scope** for this homework.

## Performance Notes

- **First Search**: 10-15 seconds (downloads and indexes 264 files)
- **Subsequent Searches**: Instant (uses cached index)
- **Web Scraping**: 1-3 seconds (depends on Jina Reader API)
- **Server Startup**: <1 second

## What's Indexed

- **264 markdown files** from FastMCP repository
- **Content types**: Documentation, examples, guides, API references
- **Repository snapshot**: January 4, 2026
- **Total size**: ~8.7 MB
- **Storage location**: `data/fastmcp-main/`

## Example Queries

### Web Scraping
```
"Scrape https://github.com/jlowin/fastmcp and tell me what it's about"
"Get the content from https://datatalks.club/ and summarize it"
"What's on the FastMCP homepage?"
```

### Word Counting
```
"Count 'MCP' on https://modelcontextprotocol.io/"
"How many times does 'python' appear on python.org?"
"Count occurrences of 'data' on datatalks.club"
```

### Documentation Search
```
"Search FastMCP docs for testing examples"
"Find information about creating MCP tools"
"Look for authentication examples in FastMCP"
"What does FastMCP say about resources?"
```

## Homework Test Results

All tools verified with homework questions:

- ✅ **Q3**: Scraped minsearch repo (31,361 chars → answer: 29184)
- ✅ **Q4**: Counted "data" on datatalks.club (61 occurrences)
- ✅ **Q5**: Searched for "demo" (first result: examples/testing_demo/README.md)

## Next Steps

1. ✅ MCP server configured
2. ✅ All tools tested and working
3. ✅ Homework answers verified
4. ⏭️ Use the tools in your Claude Code sessions
5. ⏭️ Explore FastMCP documentation with search tool

---

**Server Status**: Ready ✓
**Tools Available**: 3
**Documents Indexed**: 264
**Configuration**: Claude Code (stdio transport)
