# app/routers/site.py
import os
from pathlib import Path
from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.templating import Jinja2Templates
import smtplib, ssl, httpx
from email.message import EmailMessage

router = APIRouter()

# Get absolute paths
APP_DIR = Path(__file__).parent.parent.absolute()
templates = Jinja2Templates(directory=str(APP_DIR / "templates"))

@router.get("/", response_class=HTMLResponse)
async def read_home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@router.post("/contact", response_class=HTMLResponse)
async def contact_submit(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    message: str = Form(...)
):
    try:
        # Your email sending code...
        smtp_server = os.getenv("SMTP_SERVER")
        smtp_port = int(os.getenv("SMTP_PORT"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_pass = os.getenv("SMTP_PASS")
        to_email = os.getenv("TO_EMAIL")
        
        msg = EmailMessage()
        msg["Subject"] = f"Contact via Portfolio – {name}"
        msg["From"] = smtp_user
        msg["To"] = to_email
        msg.set_content(f"From: {name} <{email}>\n\n{message}")
        
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as server:
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        
        # Optional Flask microservice call
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                flask_url = os.getenv("FLASK_URL", "http://flask:5001/log-message")
                payload = {"name": name, "email": email, "message": message}
                await client.post(flask_url, json=payload)
        except Exception as e:
            print(f"Flask logging failed (non-critical): {e}")
        
        return templates.TemplateResponse("index.html", {"request": request, "success": True})
    
    except Exception as e:
        return templates.TemplateResponse("index.html", {"request": request, "error": str(e)})

@router.get("/download-cv")
async def download_cv():
    cv_path = APP_DIR / "static" / "cv" / "Muhammad_Farhan_CV.pdf"
    if cv_path.exists():
        return FileResponse(str(cv_path), filename="Muhammad_Farhan_CV.pdf")
    else:
        return {"error": "CV file not found"}