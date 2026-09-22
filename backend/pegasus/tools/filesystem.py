"""
PEGASUS OS — Filesystem Tool

Provides file operations: read, write, list, search, metadata.
"""

import logging
import os
from typing import Optional

logger = logging.getLogger("pegasus.tools.filesystem")


class FilesystemTool:
    """
    Filesystem tool for reading, writing, and managing files.
    Operates within a sandboxed directory for safety.
    """

    def __init__(self, base_dir: Optional[str] = None):
        self.name = "filesystem"
        self.base_dir = base_dir or os.path.expanduser("~/pegasus_workspace")
        os.makedirs(self.base_dir, exist_ok=True)

    async def read_file(self, path: str) -> Optional[str]:
        """Read a file's contents."""
        full_path = self._resolve(path)
        try:
            with open(full_path, "r", encoding="utf-8") as f:
                content = f.read()
            logger.info(f"[FS] Read: {path} ({len(content)} bytes)")
            return content
        except FileNotFoundError:
            logger.warning(f"[FS] File not found: {path}")
            return None
        except Exception as e:
            logger.error(f"[FS] Read error: {e}")
            return None

    async def write_file(self, path: str, content: str) -> bool:
        """Write content to a file."""
        full_path = self._resolve(path)
        try:
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, "w", encoding="utf-8") as f:
                f.write(content)
            logger.info(f"[FS] Wrote: {path} ({len(content)} bytes)")
            return True
        except Exception as e:
            logger.error(f"[FS] Write error: {e}")
            return False

    async def list_directory(self, path: str = ".") -> list[dict]:
        """List files and directories at a path."""
        full_path = self._resolve(path)
        items = []
        try:
            for name in sorted(os.listdir(full_path)):
                item_path = os.path.join(full_path, name)
                is_dir = os.path.isdir(item_path)
                size = os.path.getsize(item_path) if not is_dir else 0
                items.append({
                    "name": name,
                    "type": "directory" if is_dir else "file",
                    "size": size,
                })
        except Exception as e:
            logger.error(f"[FS] List error: {e}")
        return items

    async def search(self, query: str, path: str = ".") -> list[str]:
        """Search for files matching a query."""
        results = []
        full_path = self._resolve(path)
        try:
            for root, dirs, files in os.walk(full_path):
                for name in files + dirs:
                    if query.lower() in name.lower():
                        rel = os.path.relpath(os.path.join(root, name), self.base_dir)
                        results.append(rel)
        except Exception as e:
            logger.error(f"[FS] Search error: {e}")
        return results[:50]

    async def get_metadata(self, path: str) -> Optional[dict]:
        """Get file metadata."""
        full_path = self._resolve(path)
        try:
            stat = os.stat(full_path)
            return {
                "path": path,
                "size": stat.st_size,
                "is_directory": os.path.isdir(full_path),
                "modified": stat.st_mtime,
            }
        except Exception:
            return None

    def _resolve(self, path: str) -> str:
        """Resolve a relative or absolute path against the base directory safely."""
        if os.path.isabs(path):
            target = os.path.normpath(path)
        else:
            target = os.path.normpath(os.path.join(self.base_dir, path))

        # Enforce workspace security boundary
        base_norm = os.path.normpath(self.base_dir)
        if not (target == base_norm or target.startswith(base_norm + os.sep)):
            logger.warning(f"[Security] Blocked path traversal attempt outside workspace: {path}")
            raise PermissionError(f"Access denied: path '{path}' is outside active workspace boundary '{self.base_dir}'")

        return target

