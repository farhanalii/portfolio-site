from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import site # Importing the site router

app = FastAPI()

# Mounting static files directory
app.mount("/static", StaticFiles(directory="app/static"), name="static")


# include rotes
app.include_router(site.router)
