from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import google.generativeai as genai
import os
import json
from datetime import datetime

router = APIRouter()

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
- Phone: +44 7448321229
- WhatsApp: https://wa.me/+447448321229
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
- WhatsApp: https://wa.me/+447448321229
- Email: farhan.ali.se@gmail.com
- Telegram: @farhanalise
"""

# Chat session storage (in production, use Redis or database)
chat_sessions = {}

@router.get("/chatbot", response_class=HTMLResponse)
async def chatbot_page(request: Request):
    """Chatbot interface page"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>FarhanBot - AI Assistant</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            :root {
                --primary: #00d4ff;
                --primary-dark: #00b8e6;
                --secondary: #ff0080;
                --accent: #00ff88;
                --dark-blue: #0a0a0a;
                --slate-gray: #64748b;
                --light-gray: #f1f5f9;
                --white: #ffffff;
                --shadow-light: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                --shadow-medium: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                --shadow-large: 0 25px 50px -12px rgb(0 0 0 / 0.25);
                --border-radius-sm: 8px;
                --border-radius-md: 12px;
                --border-radius-lg: 16px;
                --border-radius-xl: 20px;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                position: relative;
                overflow: hidden;
            }
            
            body::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                    radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255, 0, 128, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 40%, rgba(0, 255, 136, 0.05) 0%, transparent 50%);
                pointer-events: none;
            }
            
            .chatbot-container {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: var(--border-radius-xl);
                box-shadow: 
                    0 25px 50px rgba(0, 0, 0, 0.25),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                width: 100%;
                max-width: 1200px;
                height: 800px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 2px solid rgba(0, 212, 255, 0.3);
                position: relative;
            }
            
            .chatbot-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
                border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
                box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
            }
            
            .chatbot-header {
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                color: white;
                padding: 25px;
                text-align: center;
                position: relative;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 
                    0 4px 20px rgba(0, 212, 255, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }
            
            .chatbot-header h1 {
                font-size: 2rem;
                font-weight: 800;
                margin-bottom: 8px;
                background: linear-gradient(45deg, #ffffff, var(--accent));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
                filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.3));
            }
            
            .chatbot-header p {
                font-size: 1rem;
                opacity: 0.95;
                font-weight: 500;
            }
            
            .chatbot-avatar {
                position: absolute;
                top: 20px;
                left: 25px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, var(--accent), var(--primary));
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
                box-shadow: 
                    0 4px 15px rgba(0, 0, 0, 0.2),
                    0 0 20px rgba(0, 255, 136, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                color: inherit;
                z-index: 10;
            }
            
            .chatbot-avatar:hover {
                transform: scale(1.1);
                box-shadow: 
                    0 6px 20px rgba(0, 0, 0, 0.3),
                    0 0 30px rgba(0, 255, 136, 0.6),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }
            
            .chatbot-avatar::after {
                content: '🏠';
                position: absolute;
                top: -5px;
                right: -5px;
                font-size: 12px;
                background: var(--secondary);
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .chatbot-avatar:hover::after {
                opacity: 1;
            }
            
            .chat-messages {
                flex: 1;
                padding: 30px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 25px;
                background: linear-gradient(180deg, #fafbfc 0%, #f1f5f9 100%);
                min-height: 500px;
            }
            
            .message {
                max-width: 85%;
                padding: 18px 22px;
                border-radius: var(--border-radius-lg);
                font-size: 1rem;
                line-height: 1.6;
                animation: messageSlideIn 0.3s ease-out;
                word-wrap: break-word;
            }
            
            .message.user {
                background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
                box-shadow: 
                    0 4px 12px rgba(0, 212, 255, 0.4),
                    0 0 20px rgba(0, 212, 255, 0.2);
                border: 1px solid rgba(0, 212, 255, 0.3);
            }
            
            .message.bot {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
                backdrop-filter: blur(10px);
                color: var(--dark-blue);
                align-self: flex-start;
                border-bottom-left-radius: 4px;
                border: 1px solid rgba(0, 212, 255, 0.2);
                box-shadow: 
                    0 4px 12px rgba(0, 0, 0, 0.1),
                    0 0 0 1px rgba(255, 255, 255, 0.1);
            }
            
            .message.bot br {
                display: block;
                margin: 8px 0;
            }
            
            .message.bot br + br {
                margin: 16px 0;
            }
            
            .message.bot a {
                color: var(--primary);
                text-decoration: none;
                font-weight: 600;
                border-bottom: 2px solid var(--primary);
                transition: all 0.3s ease;
                padding: 2px 6px;
                background: linear-gradient(120deg, transparent 0%, rgba(0, 212, 255, 0.1) 100%);
                border-radius: 4px;
                box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
            }
            
            .message.bot a:hover {
                color: var(--accent);
                border-bottom-color: var(--accent);
                background: linear-gradient(120deg, transparent 0%, rgba(0, 255, 136, 0.2) 100%);
                transform: translateY(-1px);
                box-shadow: 
                    0 2px 8px rgba(0, 212, 255, 0.3),
                    0 0 20px rgba(0, 255, 136, 0.3);
            }
            
            .message.bot strong {
                color: var(--secondary);
                font-weight: 700;
                text-shadow: 0 0 10px rgba(255, 0, 128, 0.3);
            }
            
            .message.bot ul, .message.bot ol {
                margin: 8px 0;
                padding-left: 20px;
            }
            
            .message.bot li {
                margin: 4px 0;
            }
            
            .chat-input-container {
                padding: 25px;
                border-top: 1px solid rgba(99, 102, 241, 0.1);
                background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
                border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
            }
            
            .chat-input-wrapper {
                display: flex;
                gap: 12px;
                align-items: flex-end;
            }
            
            .chat-input {
                flex: 1;
                padding: 16px 20px;
                border: 2px solid rgba(99, 102, 241, 0.2);
                border-radius: var(--border-radius-lg);
                font-size: 1rem;
                resize: none;
                min-height: 50px;
                max-height: 120px;
                transition: all 0.3s ease;
                font-family: inherit;
                background: white;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            
            .chat-input:focus {
                outline: none;
                border-color: var(--primary);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
                transform: translateY(-1px);
            }
            
            .send-button {
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                color: white;
                border: none;
                border-radius: var(--border-radius-lg);
                padding: 16px 24px;
                cursor: pointer;
                font-weight: 600;
                font-size: 1rem;
                transition: all 0.3s ease;
                min-width: 90px;
                box-shadow: 
                    0 4px 12px rgba(0, 212, 255, 0.4),
                    0 0 20px rgba(255, 0, 128, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .send-button:hover {
                background: linear-gradient(135deg, var(--accent), var(--secondary));
                transform: translateY(-2px);
                box-shadow: 
                    0 6px 20px rgba(0, 255, 136, 0.4),
                    0 0 30px rgba(255, 0, 128, 0.3);
            }
            
            .send-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            
            .typing-indicator {
                display: none;
                align-self: flex-start;
                padding: 12px 16px;
                background: var(--light-gray);
                border-radius: var(--border-radius-lg);
                border-bottom-left-radius: 4px;
            }
            
            .typing-dots {
                display: flex;
                gap: 4px;
            }
            
            .typing-dot {
                width: 8px;
                height: 8px;
                background: var(--slate-gray);
                border-radius: 50%;
                animation: typingBounce 1.4s infinite ease-in-out;
            }
            
            .typing-dot:nth-child(1) { animation-delay: -0.32s; }
            .typing-dot:nth-child(2) { animation-delay: -0.16s; }
            

            
            @keyframes messageSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes typingBounce {
                0%, 80%, 100% {
                    transform: scale(0);
                }
                40% {
                    transform: scale(1);
                }
            }
            
            @media (max-width: 768px) {
                .chatbot-container {
                    height: 100vh;
                    max-width: none;
                    border-radius: 0;
                }
                
                .message {
                    max-width: 90%;
                }
            }
        </style>
    </head>
    <body>
        <div class="chatbot-container">
            <div class="chatbot-header">
                <a href="/" class="chatbot-avatar" title="Back to Home">🧠</a>
                <h1>My AI Assistant</h1>
                <p>Intelligent Assistant for Muhammad Farhan's Portfolio</p>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="message bot">
                    👋 Hi! I’m your AI assistant here to help you learn more about Muhammad Farhan.

🎯 I can assist you with:
• Experience & background  
• Skills & expertise  
• Projects & tech stack  
• Job description analysis  

 <strong>💡 Just ask me anything about Muhammad Farhan — I’ve got the answers!</strong>

                </div>
            </div>
            
            <div class="typing-indicator" id="typingIndicator">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
            
            <div class="chat-input-container">
                <div class="chat-input-wrapper">
                    <textarea 
                        class="chat-input" 
                        id="chatInput" 
                        placeholder="Ask me about Muhammad Farhan... (or paste a job description to analyze)"
                        rows="1"
                    ></textarea>
                    <button class="send-button" id="sendButton">Send</button>
                </div>
            </div>
        </div>

        <script>
            let sessionId = Date.now().toString();
            
            // Add debugging
            console.log('🧠 Chatbot page loaded');
            
            const chatMessages = document.getElementById('chatMessages');
            const chatInput = document.getElementById('chatInput');
            const sendButton = document.getElementById('sendButton');
            const typingIndicator = document.getElementById('typingIndicator');
            
            // Debug element finding
            console.log('Elements found:', {
                chatMessages: !!chatMessages,
                chatInput: !!chatInput,
                sendButton: !!sendButton,
                typingIndicator: !!typingIndicator
            });
            
            // Auto-resize textarea
            chatInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            });
            
            // Send message on Enter (but allow Shift+Enter for new line)
            chatInput.addEventListener('keydown', function(e) {
                console.log('🧠 Key pressed:', e.key);
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    console.log('🧠 Enter pressed, calling sendMessage');
                    sendMessage();
                }
            });
            
            sendButton.addEventListener('click', function() {
                console.log('🧠 Send button clicked');
                sendMessage();
            });
            
            // Home link handler
            const homeLink = document.querySelector('.chatbot-avatar');
            if (homeLink) {
                homeLink.addEventListener('click', function(e) {
                    console.log('🧠 Home link clicked');
                    // Ensure navigation works
                    window.location.href = '/';
                });
            }
            
            function addMessage(content, isUser = false) {
                console.log('🧠 Adding message:', content, 'isUser:', isUser);
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
                messageDiv.innerHTML = content;
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                console.log('🧠 Message added successfully');
            }
            
            function showTyping() {
                typingIndicator.style.display = 'block';
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            function hideTyping() {
                typingIndicator.style.display = 'none';
            }
            
            async function sendMessage() {
                console.log('🧠 sendMessage function called');
                
                const message = chatInput.value.trim();
                console.log('Message:', message);
                
                if (!message) {
                    console.log('Empty message, returning');
                    return;
                }
                
                addMessage(message, true);
                chatInput.value = '';
                chatInput.style.height = 'auto';
                
                showTyping();
                
                // Check if this looks like a job description
                const isJobDescription = message.toLowerCase().includes('job') || 
                                       message.toLowerCase().includes('position') || 
                                       message.toLowerCase().includes('role') || 
                                       message.toLowerCase().includes('requirements') ||
                                       message.toLowerCase().includes('responsibilities') ||
                                       message.length > 200; // Long text likely job description
                
                try {
                    console.log('🧠 Sending request to API...');
                    const endpoint = isJobDescription ? '/api/chatbot/analyze-job' : '/api/chatbot/chat';
                    const body = isJobDescription ? 
                        JSON.stringify({
                            job_description: message,
                            session_id: sessionId
                        }) :
                        JSON.stringify({
                            message: message,
                            session_id: sessionId
                        });
                    
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: body
                    });
                    
                    console.log('🧠 Response received:', response.status);
                    const data = await response.json();
                    console.log('🧠 Response data:', data);
                    hideTyping();
                    
                    if (response.ok) {
                        addMessage(data.response);
                    } else {
                        addMessage('Sorry, I encountered an error. Please try again.');
                    }
                } catch (error) {
                    console.error('🧠 Error in sendMessage:', error);
                    hideTyping();
                    addMessage('Sorry, I am having trouble connecting. Please try again.');
                }
            }
            

        </script>
    </body>
    </html>
    """

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