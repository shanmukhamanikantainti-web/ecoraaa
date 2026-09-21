#!/usr/bin/env python3
"""Test WebSocket connection to the backend"""
import asyncio
import json
import websockets

async def test_websocket():
    uri = "ws://127.0.0.1:8420/ws"
    async with websockets.connect(uri) as websocket:
        print("Connected to WebSocket")

        # Send a get_status message
        await websocket.send(json.dumps({"type": "get_status"}))
        response = await websocket.recv()
        print(f"Status response: {response}")

        # Send an execute_goal message
        await websocket.send(json.dumps({"type": "execute_goal", "goal": "List files in workspace"}))
        response = await websocket.recv()
        print(f"Execute response: {response}")

        # Wait for progress updates
        for _ in range(5):
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                print(f"Progress: {response}")
            except asyncio.TimeoutError:
                break

if __name__ == "__main__":
    asyncio.run(test_websocket())