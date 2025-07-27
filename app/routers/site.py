from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import os, smtplib, ssl
from email.message import EmailMessage

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/", response_class=HTMLResponse)
async def read_hoome(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@router.post("/contact", response_class=HTMLResponse)
async def contact_submit(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    message: str = Form(...)
):
    try:
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
        
        return templates.TemplateResponse("index.html", {"request": request, "success": True})
    except Exception as e:
        return templates.TemplateResponse("index.html", {"request": request, "error": str(e)})
