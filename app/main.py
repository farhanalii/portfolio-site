import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

# Get the absolute path of the current file's directory (app folder)
APP_DIR = Path(__file__).parent.absolute()

# Add the app directory to Python path so we can import routers
sys.path.insert(0, str(APP_DIR))

# Now import routers
from routers import site, chatbot

app = FastAPI()

# Mount static files using absolute path
static_dir = APP_DIR / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
else:
    print(f"Warning: Static directory {static_dir} does not exist")

# Include routes
app.include_router(site.router)
app.include_router(chatbot.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
