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
    """Main portfolio page with all sections"""
    return templates.TemplateResponse("index.html", {"request": request})

@router.get("/about", response_class=HTMLResponse)
async def read_about(request: Request):
    """About page"""
    return templates.TemplateResponse("pages/about.html", {"request": request})

@router.get("/tech-stack", response_class=HTMLResponse)
async def read_tech_stack(request: Request):
    """Tech stack page"""
    return templates.TemplateResponse("pages/tech-stack.html", {"request": request})

@router.get("/projects", response_class=HTMLResponse)
async def read_projects(request: Request):
    """Projects page"""
    return templates.TemplateResponse("pages/projects.html", {"request": request})

@router.get("/contact", response_class=HTMLResponse)
async def read_contact(request: Request):
    """Contact page"""
    return templates.TemplateResponse("pages/contact.html", {"request": request})

@router.get("/download-cv")
async def download_cv():
    """Download CV endpoint"""
    cv_path = APP_DIR / "static" / "cv" / "Muhammad_Farhan_CV.pdf"
    if cv_path.exists():
        return FileResponse(str(cv_path), filename="Muhammad_Farhan_CV.pdf")
    else:
        return {"error": "CV file not found"}