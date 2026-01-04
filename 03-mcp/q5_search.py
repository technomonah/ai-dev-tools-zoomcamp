from utils.download import download_fastmcp_repo
from utils.search import (
    process_markdown_files,
    create_search_index,
    search_documents,
)

if __name__ == "__main__":
    # Step 1: Download repository
    print("Step 1: Downloading FastMCP repository...")
    repo_path = download_fastmcp_repo()
    print(f"Repository downloaded to: {repo_path}\n")

    # Step 2: Process markdown files
    print("Step 2: Processing markdown/MDX files...")
    documents = process_markdown_files(repo_path)
    print(f"Found {len(documents)} markdown files\n")

    # Step 3: Create search index
    print("Step 3: Creating search index...")
    index = create_search_index(documents)
    print("Index created successfully\n")

    # Step 4: Test search with query "demo"
    print("Step 4: Searching for 'demo'...")
    results = search_documents(index, "demo", num_results=5)

    print(f"\nTop 5 results for query 'demo':")
    print("=" * 60)
    for i, result in enumerate(results, 1):
        print(f"\n{i}. {result['path']}")
        # Print content preview (first 150 chars)
        preview = result["content"][:150].replace("\n", " ")
        print(f"   Preview: {preview}...")

    # Document first result
    if results:
        first_result = results[0]["path"]
        print(f"\n{'='*60}")
        print(f"ANSWER FOR QUESTION 5:")
        print(f"First result path: {first_result}")
        print(f"{'='*60}")
    else:
        print("\nNo results found!")
