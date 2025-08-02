#!/usr/bin/env python3
"""
Setup script for Farhan's AI Assistant
This script helps configure the Gemini API key for the chatbot.
"""

import os
import sys
from pathlib import Path

def main():
    print("🤖 Farhan's AI Assistant Setup")
    print("=" * 40)
    
    # Check if .env file exists
    env_file = Path(".env")
    
    if env_file.exists():
        print("✅ .env file found")
        with open(env_file, 'r') as f:
            content = f.read()
            if "your-gemini-api-key-here" in content:
                print("⚠️  API key not configured in .env file")
            else:
                print("✅ API key appears to be configured")
    else:
        print("❌ .env file not found")
        print("Creating .env file...")
        
        # Create .env file
        env_content = """# Google Gemini AI API Key
# Get your free API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here
"""
        
        with open(env_file, 'w') as f:
            f.write(env_content)
        print("✅ .env file created")
    
    print("\n📋 Setup Instructions:")
    print("1. Get your free Gemini API key from: https://makersuite.google.com/app/apikey")
    print("2. Edit the .env file and replace 'your-gemini-api-key-here' with your actual API key")
    print("3. Or set the environment variable: export GEMINI_API_KEY='your-api-key'")
    print("4. Run the application: python -m uvicorn app.main:app --reload")
    
    print("\n🔧 Alternative setup methods:")
    print("Method 1 - Edit .env file:")
    print("   nano .env  # or use your preferred editor")
    print("   # Replace the placeholder with your actual API key")
    
    print("\nMethod 2 - Set environment variable:")
    print("   export GEMINI_API_KEY='your-actual-api-key'")
    print("   python -m uvicorn app.main:app --reload")
    
    print("\nMethod 3 - Run with API key:")
    print("   GEMINI_API_KEY='your-api-key' python -m uvicorn app.main:app --reload")
    
    print("\n✅ Once configured, the chatbot will work at:")
    print("   - Full interface: http://localhost:8000/chatbot")
    print("   - API endpoints: http://localhost:8000/api/chatbot/chat")
    
    # Check current environment
    current_key = os.getenv("GEMINI_API_KEY")
    if current_key:
        if current_key == "your-gemini-api-key-here":
            print("\n⚠️  Environment variable set but using placeholder value")
        else:
            print(f"\n✅ Environment variable GEMINI_API_KEY is set")
    else:
        print("\n❌ Environment variable GEMINI_API_KEY is not set")

if __name__ == "__main__":
    main() 