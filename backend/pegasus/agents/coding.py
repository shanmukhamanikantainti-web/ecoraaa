"""
PEGASUS OS — Coding Agent

Capabilities:
- Code generation
- Code inspection
- Code modification
- Controlled execution
- Error detection
- Iterative correction
- File creation and modification

Code execution shall be subject to permission and sandbox restrictions.
"""

import logging
import os
from typing import Any

from .base import BaseAgent

logger = logging.getLogger("pegasus.agents.coding")


class CodingAgent(BaseAgent):
    """
    Coding Agent specializes in generating, executing, and debugging code.
    Uses the terminal and filesystem tools.
    """

    def __init__(self):
        super().__init__(name="Coding Agent")

    def can_handle(self, task_description: str) -> bool:
        """Coding agent handles code, write, create, execute, run, debug tasks."""
        keywords = [
            "code", "write", "create", "generate", "execute", "run",
            "test", "debug", "fix", "simulate", "script", "program",
            "function", "class", "module", "build", "compile", "python",
            "analyze", "inspect", "bug", "issue", "problem"
        ]
        return any(kw in task_description.lower() for kw in keywords)

    async def execute(self, step: Any, tools: dict[str, Any], context: Any) -> str:
        """Execute a coding step."""
        task = step.name
        logger.info(f"[Coding] Executing: {task}")

        filesystem = self._use_tool(tools, "filesystem")
        terminal = self._use_tool(tools, "terminal")

        # Check if this is an analysis/inspection task
        if self._is_analysis_task(task):
            return await self._analyze_code(task, filesystem, terminal)
        # Check if this is a bug fix task
        elif self._is_fix_task(task):
            return await self._fix_bug(task, filesystem, terminal)
        # Determine if we need to generate code or execute existing code
        elif self._needs_code_generation(task):
            return await self._generate_and_run(task, filesystem, terminal, context)
        elif self._needs_execution(task):
            return await self._execute_task(task, terminal)
        else:
            return await self._general_task(task, filesystem, terminal, context)

    async def _analyze_code(self, task: str, filesystem: Any, terminal: Any) -> str:
        """Analyze code in the workspace to find issues."""
        if not filesystem:
            return "Filesystem tool unavailable"

        # List files in workspace
        files = await filesystem.list_directory(".")
        python_files = [f for f in files if f["type"] == "file" and f["name"].endswith(".py")]

        if not python_files:
            return "No Python files found in workspace"

        # Read each Python file to analyze
        analysis = []
        for f in python_files[:5]:  # Limit to first 5 files
            content = await filesystem.read_file(f["name"])
            if content:
                analysis.append(f"=== {f['name']} ===\n{content}")

        # Use LLM to analyze for bugs
        combined = "\n\n".join(analysis)
        prompt = f"""Analyze the following Python code for bugs, issues, and problems.
Focus on:
1. Division by zero errors
2. Missing error handling
3. Logic bugs
4. Security issues
5. Best practice violations

Code:
{combined}

Provide a concise analysis with specific file names and line numbers where possible."""

        system_prompt = """You are ECORAA Coding Agent.
Work only inside the assigned workspace.
Inspect before modifying.
Make minimal, correct changes.
Use real tools.
Verify your work.
Never claim an action you did not perform.
Never fabricate test results."""

        result = await self._llm_call(
            system_prompt=system_prompt,
            user_prompt=prompt
        )

        return f"Code Analysis:\n{result}"

    async def _fix_bug(self, task: str, filesystem: Any, terminal: Any) -> str:
        """Fix a bug in the workspace."""
        if not filesystem:
            return "Filesystem tool unavailable"

        # First analyze to find the bug
        analysis_result = await self._analyze_code("Find bugs to fix", filesystem, terminal)

        # Read the specific file that likely has the bug
        files = await filesystem.list_directory(".")
        python_files = [f for f in files if f["type"] == "file" and f["name"].endswith(".py")]

        if not python_files:
            return "No Python files to fix"

        # Assume the first Python file is the main one (or look for calculator)
        target_file = None
        for f in python_files:
            if "calculator" in f["name"].lower():
                target_file = f["name"]
                break
        if not target_file:
            target_file = python_files[0]["name"]

        content = await filesystem.read_file(target_file)
        if not content:
            return f"Could not read {target_file}"

        # Use LLM to generate the fix
        prompt = f"""Fix the bug in the following Python file.
The task is: {task}

Current file ({target_file}):
{content}

Analysis:
{analysis_result}

Return ONLY the fixed complete file content. No markdown, no explanation."""

        fixed_code = await self._llm_call(
            system_prompt="You are a Python developer. Fix bugs in the provided code. Return only the complete fixed file.",
            user_prompt=prompt
        )

        if fixed_code and not fixed_code.startswith("LLM unavailable"):
            # Clean up
            fixed_code = fixed_code.strip()
            if fixed_code.startswith("```python"):
                fixed_code = fixed_code[len("```python"):].strip()
            if fixed_code.startswith("```"):
                fixed_code = fixed_code[3:].strip()
            if fixed_code.endswith("```"):
                fixed_code = fixed_code[:-3].strip()

            # Write the fix
            await filesystem.write_file(target_file, fixed_code)
            return f"Fixed bug in {target_file}. Changes applied."

        return f"Could not generate fix for {target_file}"

    async def _generate_and_run(
        self, task: str, filesystem: Any, terminal: Any, context: Any
    ) -> str:
        """Generate code and run it."""
        # Generate code using LLM
        code = await self._llm_call(
            system_prompt="""You are a Python coding assistant. Generate clean, working Python code.
Return ONLY the code, no markdown formatting or explanation.
Make sure the code is complete and can run independently.""",
            user_prompt=f"Write a Python script that: {task}"
        )

        if not code or code.startswith("LLM unavailable"):
            return f"Could not generate code for: {task}"

        # Clean up code (remove markdown fences if present)
        code = code.strip()
        if code.startswith("```python"):
            code = code[len("```python"):].strip()
        if code.startswith("```"):
            code = code[3:].strip()
        if code.endswith("```"):
            code = code[:-3].strip()

        # Save the code
        filename = f"{task[:30].replace(' ', '_').replace('/', '_')}.py"
        if filesystem:
            await filesystem.write_file(filename, code)

        # Execute the code
        if terminal:
            result = await terminal.execute(f"python {filename}")
            return f"Generated {filename} and executed.\n\nOutput:\n{result}"

        return f"Generated {filename} but could not execute (terminal unavailable)."

    async def _execute_task(self, task: str, terminal: Any) -> str:
        """Execute a specific command or script."""
        if terminal:
            result = await terminal.execute(task)
            return f"Execution result:\n{result}"
        return f"Cannot execute: {task} (terminal unavailable)"

    async def _general_task(
        self, task: str, filesystem: Any, terminal: Any, context: Any
    ) -> str:
        """Handle a general coding task."""
        # Use LLM to determine the best approach
        approach = await self._llm_call(
            system_prompt="You are a coding assistant. Describe briefly what needs to be done.",
            user_prompt=f"Task: {task}"
        )
        return approach if approach else f"Task acknowledged: {task}"

    def _is_analysis_task(self, task: str) -> bool:
        """Check if the task requires analyzing existing code."""
        keywords = ["analyze", "inspect", "find bug", "review", "audit", "check"]
        return any(kw in task.lower() for kw in keywords)

    def _is_fix_task(self, task: str) -> bool:
        """Check if the task requires fixing a bug."""
        keywords = ["fix", "repair", "correct", "resolve", "patch", "bug"]
        return any(kw in task.lower() for kw in keywords)

    def _needs_code_generation(self, task: str) -> bool:
        """Check if the task requires generating new code."""
        keywords = ["create", "write", "generate", "simulation", "script", "program", "build"]
        return any(kw in task.lower() for kw in keywords)

    def _needs_execution(self, task: str) -> bool:
        """Check if the task requires executing existing code."""
        keywords = ["run", "execute", "test", "debug"]
        return any(kw in task.lower() for kw in keywords)
