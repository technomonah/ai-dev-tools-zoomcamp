import requests
import zipfile
import os
from pathlib import Path


def download_fastmcp_repo(output_dir: str = "data/fastmcp") -> str:
    """
    Download FastMCP repository as ZIP and extract it.
    Returns the path to the extracted directory.

    Args:
        output_dir: Directory to store the repo (default: data/fastmcp)

    Returns:
        Path to the extracted repository
    """
    zip_url = "https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip"
    zip_path = "data/fastmcp.zip"

    # Create data directory
    Path("data").mkdir(exist_ok=True)

    # Download ZIP
    print("Downloading FastMCP repository...")
    response = requests.get(zip_url)
    response.raise_for_status()

    with open(zip_path, "wb") as f:
        f.write(response.content)

    print(f"Downloaded {len(response.content)} bytes")

    # Extract ZIP
    print("Extracting archive...")
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall("data/")

    # Remove ZIP file
    os.remove(zip_path)
    print("Cleaned up ZIP file")

    # Find extracted directory (usually fastmcp-main)
    extracted = Path("data/fastmcp-main")
    if extracted.exists():
        print(f"Repository extracted to: {extracted}")
        return str(extracted)

    # Fallback
    return str(Path(output_dir))
