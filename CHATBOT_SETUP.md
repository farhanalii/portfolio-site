# Farhan's AI Assistant Setup Guide

## 🤖 Farhan's AI Assistant - AI Assistant for Muhammad Farhan's Portfolio

Farhan's AI Assistant is an intelligent AI chatbot that helps recruiters and visitors learn about Muhammad Farhan's experience, skills, projects, and availability. It can also analyze job descriptions to provide match assessments.

## 🚀 Features

- **Personal Information**: Experience, skills, background
- **Project Details**: Tech stacks, descriptions, links
- **Job Analysis**: Match job descriptions against Muhammad's profile
- **Contact Information**: Direct links to CV, contact forms
- **Session Memory**: Remembers conversation context
- **Responsive Design**: Works on desktop and mobile
- **Floating Widget**: Easy access from any page

## 📋 Installation

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Gemini AI API Key

Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey):

```bash
export GEMINI_API_KEY="your-gemini-api-key-here"
```

Or create a `.env` file in your project root:

```env
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Run the Application

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🎯 Usage

### Full Chatbot Interface
Visit `/chatbot` for the complete chat interface with job analysis features.

### Floating Widget
The floating widget appears on all pages. Click the "Ask AI Assistant" button in the bottom-right corner.

### Navigation Link
Click "AI Assistant" in the main navigation menu.

## 💬 Sample Questions

**Experience & Background:**
- "What is Muhammad Farhan's experience?"
- "Tell me about his work at Dalba Group"
- "What's his background?"

**Skills & Expertise:**
- "What are his top skills?"
- "What technologies does he know?"
- "Tell me about his Python experience"

**Projects:**
- "What projects has he worked on?"
- "What tech stack did he use in Project X?"
- "Tell me about his microservices experience"

**Availability:**
- "Where is he based?"
- "Is he open to remote work?"
- "What's his notice period?"

**Contact:**
- "How can I contact him?"
- "Can I see his resume?"
- "What's his email?"

## 🔍 Job Analysis Feature

Paste any job description and Farhan's AI Assistant will provide:

1. **Matching Skills** - Direct skill matches
2. **Transferable Skills** - Related applicable skills  
3. **Skill Gaps** - Areas for development
4. **Overall Match Score** - 1-10 rating
5. **Why Muhammad Would Be a Good Fit** - 2-3 sentence assessment
6. **Recommendation** - Whether to apply and suggestions

## 🎨 Customization

### Profile Data
Update Muhammad's profile information in `app/routers/chatbot.py`:

```python
FARHAN_PROFILE = """
[Update with current information]
"""
```

### Styling
Modify the chatbot appearance in:
- `app/static/js/farhanbot-widget.js` (floating widget)
- `app/routers/chatbot.py` (full interface)

### Bot Personality
Adjust the system prompt in the chat endpoints to change the bot's tone and behavior.

## 🔧 Technical Details

### Backend
- **Framework**: FastAPI
- **AI Model**: Google Gemini Pro
- **Session Management**: In-memory (can be upgraded to Redis/database)
- **API Endpoints**: 
  - `POST /api/chatbot/chat` - Handle chat messages
  - `POST /api/chatbot/analyze-job` - Job description analysis
  - `GET /api/chatbot/session/{session_id}` - Get session history

### Frontend
- **Widget**: Vanilla JavaScript with CSS animations
- **Full Interface**: HTML/CSS/JavaScript with responsive design
- **Integration**: Embedded in existing portfolio design

## 🚀 Deployment

### Environment Variables
```bash
GEMINI_API_KEY=your-api-key
```

### Production Considerations
- Use Redis or database for session storage
- Add rate limiting for API endpoints
- Implement proper error handling
- Add logging for debugging
- Consider caching for common responses

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**: Ensure `GEMINI_API_KEY` is set correctly
2. **Import Error**: Make sure `google-generativeai` is installed
3. **Widget Not Loading**: Check browser console for JavaScript errors
4. **Styling Issues**: Verify CSS is loading properly

### Debug Mode
Add logging to see what's happening:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📞 Support

For issues or questions about FarhanBot:
- Check the browser console for errors
- Verify API key configuration
- Test the `/chatbot` endpoint directly
- Review the FastAPI logs

---

**Farhan's AI Assistant** - Making Muhammad Farhan's portfolio more interactive and recruiter-friendly! 🤖✨ 