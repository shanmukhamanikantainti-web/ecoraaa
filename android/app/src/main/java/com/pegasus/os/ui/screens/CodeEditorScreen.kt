package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*

/**
 * Code Editor Window
 * Professional code editing environment with file tree and editor area.
 */
@Composable
fun CodeEditorScreen(
    coreManager: PegasusCoreManager,
    isWindowed: Boolean = false
) {
    var selectedFile by remember { mutableStateOf("main.py") }

    val files = listOf(
        "main.py", "config.py", "utils.py", "test_main.py",
        "requirements.txt", "README.md", ".gitignore"
    )

    val sampleCode = mapOf(
        "main.py" to """#!/usr/bin/env python3
""" + "\"\"\"" + """
PEGASUS OS — Main Entry Point
""" + "\"\"\"" + """

import asyncio
from pegasus.core.orchestrator import PegasusOrchestrator

async def main():
    orchestrator = PegasusOrchestrator()
    await orchestrator.start()
    print("PEGASUS Core online")

if __name__ == "__main__":
    asyncio.run(main())""",
        "config.py" to """# PEGASUS Configuration
HOST = "0.0.0.0"
PORT = 8420
DEBUG = True""",
        "utils.py" to """# Utility functions
def format_size(bytes):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024:
            return f"{bytes:.1f} {unit}"
        bytes /= 1024
    return f"{bytes:.1f} TB\"""",
        "test_main.py" to """import pytest
from main import main

def test_main():
    assert True  # Placeholder""",
        "requirements.txt" to """fastapi==0.109.0
uvicorn==0.27.0
pydantic==2.5.3""",
        "README.md" to """# PEGASUS OS

AI-native desktop operating environment.

## Quick Start
```bash
python main.py
```""",
        ".gitignore" to """__pycache__/
*.pyc
.env
.venv/"""
    )

    Row(modifier = Modifier.fillMaxSize()) {
        // File tree sidebar
        Column(
            modifier = Modifier
                .width(160.dp)
                .fillMaxHeight()
                .background(SecondaryBackground)
        ) {
            // Project header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Icon(
                    Icons.Outlined.Folder,
                    contentDescription = null,
                    tint = PegasusAccent,
                    modifier = Modifier.size(14.dp)
                )
                Text(
                    text = "pegasus-os",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium,
                    color = PrimaryText
                )
            }

            HorizontalDivider(color = SubtleBorder, thickness = 1.dp)

            // File list
            LazyColumn(
                modifier = Modifier.padding(vertical = 4.dp)
            ) {
                itemsIndexed(files) { _, file ->
                    val isSelected = file == selectedFile
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                if (isSelected) AccentBackground
                                else SecondaryBackground
                            )
                            .clickable { selectedFile = file }
                            .padding(horizontal = 10.dp, vertical = 5.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = when {
                                file.endsWith(".py") -> Icons.Outlined.Code
                                file.endsWith(".md") -> Icons.Outlined.Description
                                file.endsWith(".txt") -> Icons.Outlined.TextSnippet
                                else -> Icons.Outlined.InsertDriveFile
                            },
                            contentDescription = null,
                            tint = if (isSelected) PegasusAccent else TertiaryText,
                            modifier = Modifier.size(12.dp)
                        )
                        Text(
                            text = file,
                            fontSize = 11.sp,
                            color = if (isSelected) PegasusAccent else SecondaryText
                        )
                    }
                }
            }
        }

        // Editor area
        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight()
                .background(MainBackground)
        ) {
            // File tab bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(PrimarySurface)
                    .padding(horizontal = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp))
                        .background(ElevatedSurface)
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = selectedFile,
                        fontSize = 11.sp,
                        color = PrimaryText
                    )
                    Text(
                        text = "\u00D7",
                        fontSize = 12.sp,
                        color = TertiaryText
                    )
                }
            }

            // Code content
            val code = sampleCode[selectedFile] ?: "// No content"

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(12.dp)
            ) {
                itemsIndexed(code.lines()) { index, line ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        // Line number
                        Text(
                            text = "${index + 1}",
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            color = DisabledText,
                            modifier = Modifier.width(30.dp)
                        )
                        // Code line
                        Text(
                            text = line,
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace,
                            color = PrimaryText,
                            lineHeight = 18.sp
                        )
                    }
                }
            }
        }
    }
}
