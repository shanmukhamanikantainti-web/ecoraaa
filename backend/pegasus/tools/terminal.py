"""
PEGASUS OS — Terminal Tool

Provides command execution, output capture, and process management.
"""

import asyncio
import logging
import os
import subprocess
from typing import Optional

logger = logging.getLogger("pegasus.tools.terminal")


class TerminalTool:
    """
    Terminal tool for executing commands and capturing output.
    Runs commands in a sandboxed working directory.
    """

    def __init__(self, working_dir: Optional[str] = None):
        self.name = "terminal"
        self.working_dir = working_dir or os.path.expanduser("~")
        self.command_history: list[dict] = []

    async def execute(self, command: str, timeout: int = 60) -> str:
        """
        Execute a shell command and return its output.
        Includes safety limits on execution time.
        """
        logger.info(f"[Terminal] Executing: {command}")

        try:
            process = await asyncio.create_subprocess_shell(
                command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=self.working_dir,
            )

            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=timeout
            )

            stdout_text = stdout.decode("utf-8", errors="replace").strip()
            stderr_text = stderr.decode("utf-8", errors="replace").strip()

            result = stdout_text
            if stderr_text:
                result += f"\n[stderr]\n{stderr_text}" if result else stderr_text

            # Record in history
            self.command_history.append({
                "command": command,
                "exit_code": process.returncode,
                "output_length": len(result),
            })

            # Limit history
            if len(self.command_history) > 100:
                self.command_history = self.command_history[-100:]

            return result if result else f"Command completed (exit code: {process.returncode})"

        except asyncio.TimeoutError:
            logger.warning(f"Command timed out: {command}")
            return f"Command timed out after {timeout}s: {command}"

        except Exception as e:
            logger.error(f"Command failed: {e}")
            return f"Error: {str(e)}"

    async def execute_python(self, code: str, timeout: int = 30) -> str:
        """Execute a Python code snippet."""
        return await self.execute(f"python3 -c '''{code}'''", timeout=timeout)

    def get_history(self) -> list[dict]:
        """Get command execution history."""
        return self.command_history
