"""
PEGASUS OS — Python Backend Entry Point
Launches the PEGASUS Core server with API and WebSocket endpoints.
"""

import uvicorn
from pegasus.api.app import create_app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8420,
        reload=True,
        log_level="info"
    )
