# app/routers/site.py
from pathlib import Path
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()

# Get absolute paths
APP_DIR = Path(__file__).parent.parent.absolute()
templates = Jinja2Templates(directory=str(APP_DIR / "templates"))

@router.get("/", response_class=HTMLResponse)
async def read_home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@router.get("/download-cv")
async def download_cv():
    cv_path = APP_DIR / "static" / "cv" / "Muhammad_Farhan_CV.pdf"
    if cv_path.exists():
        return FileResponse(str(cv_path), filename="Muhammad_Farhan_CV.pdf")
    else:
        return {"error": "CV file not found"}