from pathlib import Path
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import google.generativeai as genai
import os
import json
from datetime import datetime

router = APIRouter()
APP_DIR = Path(__file__).parent.parent.absolute()
templates = Jinja2Templates(directory=str(APP_DIR / "templates"))

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

def test_gemini_api(api_key):
    """Test if the Gemini API key is valid and working"""
    try:
        genai.configure(api_key=api_key)
        # Try to list models to test the API
        models = genai.list_models()
        available_models = [model.name for model in models if 'generateContent' in model.supported_generation_methods]
        print(f"Available models: {available_models}")
        return True, available_models
    except Exception as e:
        print(f"API test failed: {e}")
        return False, str(e)

# Configure Gemini AI
api_key = os.getenv("GEMINI_API_KEY")
if not api_key or api_key == "your-gemini-api-key-here":
    print("ERROR: GEMINI_API_KEY not found or not configured properly")
    print("Please set your Gemini API key in environment variables or .env file")
    print("Get your free API key from: https://makersuite.google.com/app/apikey")
    # Don't initialize the model if no valid API key
    model = None
else:
    try:
        # Test the API key first
        api_working, available_models = test_gemini_api(api_key)
        if not api_working:
            print(f"❌ API key test failed: {available_models}")
            model = None
        else:
            # Try to initialize with available models (prioritize working models)
            model = None
            for model_name in ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash']:
                try:
                    model = genai.GenerativeModel(model_name)
                    print(f"✅ Gemini AI configured successfully with {model_name}")
                    break
                except Exception as model_error:
                    print(f"❌ Failed to initialize {model_name}: {model_error}")
                    continue
            
            if model is None:
                print("❌ Could not initialize any Gemini model")
                print(f"Available models: {available_models}")
    except Exception as e:
        print(f"ERROR configuring Gemini AI: {e}")
        model = None

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class JobAnalysis(BaseModel):
    job_description: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: str

# Muhammad Farhan's profile data
FARHAN_PROFILE = """
Muhammad Farhan - Senior Backend Engineer / Senior Python Developer

PERSONAL INFO:
- Name: Muhammad Farhan
- Title: Senior Backend Engineer / Senior Python Developer
- Location: Manchester, United Kingdom (Available globally - Remote/Hybrid)
- Email: farhan.ali.se@gmail.com
- Phone: +44 7467 966765
- WhatsApp: https://wa.me/+447467966765
- Telegram: @farhanalise
- Email: farhan.ali.se@gmail.com
- GitHub: https://github.com/farhanalii
- LinkedIn: https://linkedin.com/in/farhanalise
- CV Download: https://muhammadfarhan.work/download-cv
- About Me: https://muhammadfarhan.work/about
- Tech Stack: https://muhammadfarhan.work/tech-stack
- Projects: https://muhammadfarhan.work/projects
- Availability: https://muhammadfarhan.work/contact
- Education: https://muhammadfarhan.work/education
- Certifications: https://muhammadfarhan.work/

EXPERIENCE (7+ Years):
1. Senior Backend Engineer - Dalba Group of Companies, Riyadh, Saudi Arabia (Remote)
   (October 2020 - Present)
   - Developed modular Python microservices using Flask and FastAPI
   - Built microservices for quoting, automated billing, real-time notifications
   - Optimized PostgreSQL databases, improving performance by 40%
   - Led CI/CD pipelines using GitHub Actions and Docker for AWS deployments
   - Designed secure API endpoints with token-based access control
   - Developed and customized Odoo modules using Python
   - Tech Stack: Python, Flask, FastAPI, Pandas, NumPy, Pytest, Odoo(ORM/MVC/XML), JavaScript,
    PostgreSQL, SQL, REST APIs, GitHub, Git Flow, Docker, Linux, Nginx, CI/CD (GitHubActions,
    Jenkins), AWS (EC2, S3, API Gateway), DigitalOcean, Alibaba Cloud, Jira, Confluence, Agile/Scrum

2. Python Developer - Napollo Software Design (Lahore Office) - Remote for New York HQ, USA
   (November 2019 - September 2020)
   - Designed secure backend solutions for EHR, HRMS, and financial systems
   - Created secure API endpoints and data ingestion pipelines
   - Built scalable backend infrastructure with robust version control
   - Tech Stack: Python, Flask, Pandas, NumPy, Odoo, PostgreSQL, AWS, Docker

3. Software Developer - Axiom World, Lahore, Pakistan
   (March 2018 - Oct 2019)
   - Delivered end-to-end backend modules for HR, Sales, Inventory, and Education systems
   - Designed scalable backend architectures and reusable Python modules
   - Tech Stack: Python, REST APIs, PostgreSQL, Odoo, Git, AWS, Docker

TOP SKILLS:
- Python Programming: Clean, scalable, production-grade code
- Backend Development: Django REST, Flask, FastAPI, RESTful APIs
- System Integration: Third-party APIs, payment gateways, external systems
- Microservices & Architecture: Microservices design patterns, service decomposition
- Data Handling: Pandas, NumPy, JSON, ETL pipelines, CSV processing
- Odoo ERP Development: Custom modules, workflows, reports
- Database Management: PostgreSQL & SQL schema design, performance tuning
- Cloud & Deployment: AWS (Lambda, EC2, S3), DigitalOcean, Linux, Nginx
- Docker & CI/CD: Docker, Kubernetes(Basic), CI/CD pipelines, GitHub Actions
- Testing & Quality: Unit testing(Pytest), code reviews, debugging
give link for batter reivew https://muhammadfarhan.work/tech-stack


PROJECTS:
1. E-commerce Platform - Enterprise Odoo-based platform with payment gateways and inventory management
2. Mobile App API - High-performance RESTful API using Flask for mobile applications
3. Data Pipeline System - FastAPI-based real-time data processing deployed on AWS
4. HR Process Automation - Complete HR workflows automation using Odoo and Python
5. Microservices Architecture - FastAPI, Docker, and Kubernetes for scalable deployment
6. Business Analytics Dashboard - Flask, PostgreSQL, and Chart.js for real-time insights
give link for batter reivew https://muhammadfarhan.work/projects


AVAILABILITY:
- Open to full-time positions
- Contract/freelance projects welcome
- 1 month notice period
- Available globally (Remote/Hybrid)

EDUCATION:
- BSc (Hons) Software Engineering | Virtual University of Pakistan (October 2019)

CERTIFICATIONS:
- Data analysis with python - IBM
- Working with Version Control - University of Leeds
- An Introduction to Cryptography - University of Leeds
- Agile Project Management - Google
- Career Essentials in GitHub Professional Certificate - Github
- Docker Foundation Professional Certificate - Github

LINKS:
- CV Download: https://muhammadfarhan.work/download-cv
- GitHub: https://github.com/farhanalii
- LinkedIn: https://linkedin.com/in/farhanalise
- WhatsApp: https://wa.me/+447467966765
- Email: farhan.ali.se@gmail.com
- Telegram: @farhanalise
"""

# Chat session storage (in production, use Redis or database)
chat_sessions = {}

@router.get("/chatbot", response_class=HTMLResponse)
async def chatbot_page(request: Request):
    """Chatbot interface page"""
    return templates.TemplateResponse(request, "pages/chatbot.html")

@router.post("/api/chatbot/chat")
async def chat_with_bot(chat_message: ChatMessage):
    """Handle chat messages with FarhanBot"""
    try:
        # Check if model is properly configured
        if model is None:
            return ChatResponse(
                response="I am sorry, but the AI assistant is not properly configured. The Gemini API key is either missing, invalid, or the API is not accessible. Please contact the administrator to set up a valid API key. You can still learn about Muhammad Farhan by exploring the website sections.",
                session_id=chat_message.session_id or "default",
                timestamp=datetime.now().isoformat()
            )
        
        # Create system prompt for the bot
        system_prompt = f"""
You are Farhan's AI Assistant, an AI assistant for Muhammad Farhan's portfolio website. You are helpful, professional, and recruiter-friendly.

Use this profile information to answer questions:
{FARHAN_PROFILE}

Instructions:
- Be professional but conversational and friendly
- Provide specific examples when discussing skills and experience
- If asked about job fit, analyze requirements vs skills honestly but positively
- Encourage contacting Muhammad directly for detailed discussions
- Never make up information not provided above
- Keep responses concise but informative
- Use proper formatting with line breaks and spacing for readability
- Use bullet points when listing multiple items
- Use bold text for important points and headings
- Structure responses with clear sections and proper spacing
- If asked about contact info, mention the website's contact section
- If asked about CV/resume, mention the download option on the website

Format your responses with:
- Use <br><br> for line breaks between major sections
- Use <br> for single line breaks within sections
- Use <strong>text</strong> for bold headings and important points
- Use bullet points (•) for lists with proper spacing
- Structure responses with clear paragraphs and sections
- Add proper spacing for readability
- Professional but engaging tone
- For links, use <a href="URL">Link Text</a> format only once per link
- Do not repeat the same link multiple times in the same response

Tone: Helpful, concise, recruiter-friendly, and professional.

Answer the user's question: {chat_message.message}
"""

        # Generate response using Gemini
        try:
            response = model.generate_content(system_prompt)
            
            if not response.text:
                return ChatResponse(
                    response="I am sorry, but I received an empty response from the AI service. Please try again later.",
                    session_id=chat_message.session_id or "default",
                    timestamp=datetime.now().isoformat()
                )
            
            # Store session for memory (simple implementation)
            if chat_message.session_id:
                if chat_message.session_id not in chat_sessions:
                    chat_sessions[chat_message.session_id] = []
                chat_sessions[chat_message.session_id].append({
                    "user": chat_message.message,
                    "bot": response.text,
                    "timestamp": datetime.now().isoformat()
                })
            
            return ChatResponse(
                response=response.text,
                session_id=chat_message.session_id or "default",
                timestamp=datetime.now().isoformat()
            )
            
        except Exception as api_error:
            error_msg = str(api_error)
            if "quota" in error_msg.lower() or "429" in error_msg:
                return ChatResponse(
                    response="I am sorry, but I have reached the daily limit for AI responses. Please try again tomorrow or contact Muhammad directly for immediate assistance.",
                    session_id=chat_message.session_id or "default",
                    timestamp=datetime.now().isoformat()
                )
            elif "rate" in error_msg.lower():
                return ChatResponse(
                    response="I am sorry, but I am receiving too many requests right now. Please wait a moment and try again.",
                    session_id=chat_message.session_id or "default",
                    timestamp=datetime.now().isoformat()
                )
            else:
                return ChatResponse(
                    response="I am sorry, but I encountered an error while processing your request. Please try again later or contact the administrator.",
                    session_id=chat_message.session_id or "default",
                    timestamp=datetime.now().isoformat()
                )
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return ChatResponse(
            response="I am sorry, but I encountered an error while processing your request. Please try again later or contact the administrator.",
            session_id=chat_message.session_id or "default",
            timestamp=datetime.now().isoformat()
        )

@router.post("/api/chatbot/analyze-job")
async def analyze_job_match(job_analysis: JobAnalysis):
    """Analyze job description against Muhammad Farhan's profile"""
    try:
        # Check if model is properly configured
        if model is None:
            return ChatResponse(
                response="I am sorry, but the AI assistant is not properly configured for job analysis. The Gemini API key is either missing, invalid, or the API is not accessible. Please contact the administrator to set up a valid API key. You can still learn about Muhammad Farhan's skills and experience by exploring the website sections.",
                session_id=job_analysis.session_id or "default",
                timestamp=datetime.now().isoformat()
            )
        
        analysis_prompt = f"""
You are Farhan's AI Assistant, analyzing a job description against Muhammad Farhan's profile.

Muhammad Farhan's Profile:
{FARHAN_PROFILE}

Job Description:
{job_analysis.job_description}

Please provide a structured analysis with the following format:

**Job Match Analysis for Muhammad Farhan**

**1. Matching Skills:**
[List specific skills that directly match the job requirements]

**2. Transferable Skills:**
[Related skills that could apply to this role]

**3. Skill Gaps:**
[What skills might need development or learning]

**4. Overall Match Score:**
[Score out of 10 with brief explanation]

**5. Why Muhammad Would Be a Good Fit:**
[2-3 sentences explaining why he would be valuable for this role]

**Recommendation:**
[Brief recommendation on whether to apply and any suggestions]

Format your response with:
- Use <br><br> for line breaks between major sections
- Use <br> for single line breaks within sections
- Use <strong>text</strong> for bold headings and important points
- Use bullet points (•) for lists with proper spacing
- Structure responses with clear paragraphs and sections
- Add proper spacing for readability
- Professional but engaging tone
- For links, use <a href="URL">Link Text</a> format only once per link
- Do not repeat the same link multiple times in the same response

Be honest but positive in your assessment. Focus on Muhammad's strengths while acknowledging areas for growth.
"""

        # Generate analysis using Gemini
        try:
            response = model.generate_content(analysis_prompt)
            
            if not response.text:
                return ChatResponse(
                    response="I am sorry, but I received an empty response while analyzing the job description. Please try again later.",
                    session_id=job_analysis.session_id or "default",
                    timestamp=datetime.now().isoformat()
                )
            
            # Store session for memory
            if job_analysis.session_id:
                if job_analysis.session_id not in chat_sessions:
                    chat_sessions[job_analysis.session_id] = []
                chat_sessions[job_analysis.session_id].append({
                    "user": f"Job Analysis Request: {job_analysis.job_description[:100]}...",
                    "bot": response.text,
                    "timestamp": datetime.now().isoformat()
                })
            
            return ChatResponse(
                response=response.text,
                session_id=job_analysis.session_id or "default",
                timestamp=datetime.now().isoformat()
            )
            
        except Exception as api_error:
            error_msg = str(api_error)
            if "quota" in error_msg.lower() or "429" in error_msg:
                return ChatResponse(
                    response="I am sorry, but I have reached the daily limit for AI responses. Please try again tomorrow or contact Muhammad directly for immediate assistance.",
                    session_id=job_analysis.session_id or "default",
                    timestamp=datetime.now().isoformat()
                )
            elif "rate" in error_msg.lower():
                return ChatResponse(
                    response="I am sorry, but I am receiving too many requests right now. Please wait a moment and try again.",
                    session_id=job_analysis.session_id or "default",
                    timestamp=datetime.now().isoformat()
                )
            else:
                return ChatResponse(
                    response="I am sorry, but I encountered an error while analyzing the job description. Please try again later or contact the administrator.",
                    session_id=job_analysis.session_id or "default",
                    timestamp=datetime.now().isoformat()
                )
        
    except Exception as e:
        print(f"Error in job analysis endpoint: {e}")
        return ChatResponse(
            response="I am sorry, but I encountered an error while analyzing the job description. Please try again later or contact the administrator.",
            session_id=job_analysis.session_id or "default",
            timestamp=datetime.now().isoformat()
        )

@router.get("/api/chatbot/session/{session_id}")
async def get_chat_session(session_id: str):
    """Get chat session history"""
    if session_id in chat_sessions:
        return {"session": chat_sessions[session_id]}
    return {"session": []} 