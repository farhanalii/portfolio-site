#!/usr/bin/env python3
"""
Test script for Gemini API key
This script helps verify if your Gemini API key is working correctly.
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv

def test_gemini_api():
    """Test the Gemini API key"""
    print("🤖 Testing Gemini API Key")
    print("=" * 40)
    
    # Load environment variables
    load_dotenv()
    
    # Get API key
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key or api_key == "your-gemini-api-key-here":
        print("❌ No valid API key found")
        print("Please set your Gemini API key in the .env file or environment variable")
        print("Get your free API key from: https://makersuite.google.com/app/apikey")
        return False
    
    print(f"✅ API key found: {api_key[:10]}...")
    
    try:
        # Configure the API
        genai.configure(api_key=api_key)
        print("✅ API configured successfully")
        
        # Test by listing models
        print("📋 Testing model availability...")
        models = genai.list_models()
        
        # Filter for text generation models
        text_models = []
        for model in models:
            if 'generateContent' in model.supported_generation_methods:
                text_models.append(model.name)
        
        print(f"✅ Found {len(text_models)} text generation models:")
        for model in text_models:
            print(f"   - {model}")
        
        # Test with a specific model
        test_models = ['gemini-1.5-pro', 'gemini-pro', 'gemini-1.5-flash']
        
        for model_name in test_models:
            try:
                print(f"\n🧪 Testing {model_name}...")
                model = genai.GenerativeModel(model_name)
                
                # Test with a simple prompt
                response = model.generate_content("Hello, this is a test message.")
                
                if response.text:
                    print(f"✅ {model_name} is working!")
                    print(f"   Response: {response.text[:100]}...")
                    return True
                else:
                    print(f"❌ {model_name} returned empty response")
                    
            except Exception as e:
                print(f"❌ {model_name} failed: {e}")
                continue
        
        print("\n❌ None of the tested models are working")
        return False
        
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_gemini_api()
    
    if success:
        print("\n🎉 Gemini API is working correctly!")
        print("You can now use the chatbot on your website.")
    else:
        print("\n🔧 Troubleshooting steps:")
        print("1. Make sure you have a valid API key from https://makersuite.google.com/app/apikey")
        print("2. Check that your API key is correctly set in the .env file")
        print("3. Ensure you have internet connectivity")
        print("4. Try regenerating your API key if the issue persists") 