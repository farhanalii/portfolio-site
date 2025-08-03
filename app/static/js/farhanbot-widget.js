// FarhanBot Widget - Floating Chat Interface
class FarhanBotWidget {
    constructor() {
        this.isOpen = false;
        this.sessionId = Date.now().toString();
        this.init();
    }

    init() {
        this.createWidget();
        this.bindEvents();
        console.log('🤖 Farhan\'s AI Assistant Widget initialized');
        
        // Add debugging for menu clicks
        const chatbotLinks = document.querySelectorAll('a[href="/chatbot"]');
        chatbotLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                console.log('🧠 AI Assistant menu link clicked!');
                // Let the default navigation happen
            });
        });
        
        // Add debugging for widget toggle
        const toggle = document.getElementById('farhanbotToggle');
        if (toggle) {
            toggle.addEventListener('click', function() {
                console.log('🧠 Widget toggle clicked!');
            });
        }
    }

    createWidget() {
        // Create widget container
        const widget = document.createElement('div');
        widget.id = 'farhanbot-widget';
        widget.innerHTML = `
            <div class="farhanbot-toggle" id="farhanbotToggle">
                <div class="farhanbot-avatar">🧠</div>
                <div class="farhanbot-label">My AI Arsenal</div>
            </div>
            
            <div class="farhanbot-chat" id="farhanbotChat">
                <div class="farhanbot-header">
                    <div class="farhanbot-title">
                        <a href="/" class="farhanbot-avatar-small" title="Back to Home">🧠</a>
                        <div>
                            <h3>My AI Assistant</h3>
                            <p>Intelligent Assistant</p>
                        </div>
                    </div>
                    <button class="farhanbot-close" id="farhanbotClose">×</button>
                </div>
                
                <div class="farhanbot-messages" id="farhanbotMessages">
                    <div class="farhanbot-message bot">
                        👋 Hi! I’m your AI assistant here to help you learn more about Muhammad Farhan.

🎯 I can assist you with:
• Experience & background  
• Skills & expertise  
• Projects & tech stack  
• Job description analysis  

<strong>💡 Just ask me anything about Muhammad Farhan — I’ve got the answers!</strong>


                    </div>
                </div>
                
                <div class="farhanbot-typing" id="farhanbotTyping">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                
                <div class="farhanbot-input-container">
                    <div class="farhanbot-input-wrapper">
                        <textarea 
                            class="farhanbot-input" 
                            id="farhanbotInput" 
                            placeholder="Ask me about Muhammad Farhan... (or paste a job description to analyze)"
                            rows="1"
                        ></textarea>
                        <button class="farhanbot-send" id="farhanbotSend">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22,2 15,22 11,13 2,9"></polygon>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="farhanbot-quick-actions">
                        <button class="quick-action" data-action="experience">Experience</button>
                        <button class="quick-action" data-action="skills">Skills</button>
                        <button class="quick-action" data-action="projects">Projects</button>
                        <button class="quick-action" data-action="contact">Contact</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        
        // Add styles
        this.addStyles();
    }

    addStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            #farhanbot-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            
            .farhanbot-toggle {
                background: linear-gradient(135deg, #00d4ff, #ff0080);
                color: white;
                padding: 14px 20px;
                border-radius: 50px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 
                    0 8px 25px rgba(0, 212, 255, 0.4),
                    0 0 20px rgba(255, 0, 128, 0.3);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                font-weight: 700;
                font-size: 15px;
            }
            
            .farhanbot-toggle:hover {
                transform: translateY(-3px);
                box-shadow: 
                    0 12px 35px rgba(0, 212, 255, 0.5),
                    0 0 30px rgba(255, 0, 128, 0.4);
                background: linear-gradient(135deg, #00ff88, #ff0080);
            }
            
            .farhanbot-avatar {
                width: 24px;
                height: 24px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
            }
            
            .farhanbot-chat {
                position: absolute;
                bottom: 70px;
                right: 0;
                width: 420px;
                height: 600px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                box-shadow: 
                    0 25px 50px rgba(0, 0, 0, 0.25),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                display: none;
                flex-direction: column;
                border: 2px solid rgba(0, 212, 255, 0.3);
                overflow: hidden;
                position: relative;
            }
            
            .farhanbot-chat::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #00d4ff, #ff0080, #00ff88);
                border-radius: 20px 20px 0 0;
                box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
            }
            
            .farhanbot-chat.open {
                display: flex;
                animation: farhanbotSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            @keyframes farhanbotSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .farhanbot-header {
                background: linear-gradient(135deg, #00d4ff, #ff0080);
                color: white;
                padding: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 
                    0 4px 20px rgba(0, 212, 255, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }
            
            .farhanbot-title {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .farhanbot-avatar-small {
                width: 32px;
                height: 32px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                color: inherit;
            }
            
            .farhanbot-avatar-small:hover {
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
            }
            
            .farhanbot-avatar-small::after {
                content: '🏠';
                position: absolute;
                top: -3px;
                right: -3px;
                font-size: 10px;
                background: #ff0080;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .farhanbot-avatar-small:hover::after {
                opacity: 1;
            }
            
            .farhanbot-title h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 700;
            }
            
            .farhanbot-title p {
                margin: 0;
                font-size: 12px;
                opacity: 0.9;
            }
            
            .farhanbot-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.3s ease;
            }
            
            .farhanbot-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .farhanbot-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 15px;
                min-height: 350px;
            }
            
            .farhanbot-message {
                max-width: 85%;
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 14px;
                line-height: 1.4;
                animation: messageSlideIn 0.3s ease-out;
            }
            
            .farhanbot-message.user {
                background: #0c70f2;
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }
            
            .farhanbot-message.bot {
                background: #f1f5f9;
                color: #0a192f;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
            }
            
            .farhanbot-message.bot br {
                display: block;
                margin: 6px 0;
            }
            
            .farhanbot-message.bot br + br {
                margin: 12px 0;
            }
            
            .farhanbot-message.bot a {
                color: #00d4ff;
                text-decoration: none;
                font-weight: 600;
                border-bottom: 2px solid #00d4ff;
                transition: all 0.3s ease;
                padding: 2px 6px;
                background: linear-gradient(120deg, transparent 0%, rgba(0, 212, 255, 0.1) 100%);
                border-radius: 4px;
                box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
            }
            
            .farhanbot-message.bot a:hover {
                color: #00ff88;
                border-bottom-color: #00ff88;
                background: linear-gradient(120deg, transparent 0%, rgba(0, 255, 136, 0.2) 100%);
                transform: translateY(-1px);
                box-shadow: 
                    0 2px 8px rgba(0, 212, 255, 0.3),
                    0 0 20px rgba(0, 255, 136, 0.3);
            }
            
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
            
            .farhanbot-typing {
                display: none;
                align-self: flex-start;
                padding: 10px 14px;
                background: #f1f5f9;
                border-radius: 12px;
                border-bottom-left-radius: 4px;
                margin: 0 16px 8px 16px;
            }
            
            .typing-dots {
                display: flex;
                gap: 4px;
            }
            
            .typing-dots span {
                width: 6px;
                height: 6px;
                background: #64748b;
                border-radius: 50%;
                animation: typingBounce 1.4s infinite ease-in-out;
            }
            
            .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes typingBounce {
                0%, 80%, 100% {
                    transform: scale(0);
                }
                40% {
                    transform: scale(1);
                }
            }
            
            .farhanbot-input-container {
                padding: 16px;
                border-top: 1px solid #f1f5f9;
                background: white;
            }
            
            .farhanbot-input-wrapper {
                display: flex;
                gap: 8px;
                align-items: flex-end;
                margin-bottom: 12px;
            }
            
            .farhanbot-input {
                flex: 1;
                padding: 10px 12px;
                border: 2px solid #f1f5f9;
                border-radius: 12px;
                font-size: 14px;
                resize: none;
                min-height: 40px;
                max-height: 100px;
                transition: border-color 0.3s ease;
                font-family: inherit;
            }
            
            .farhanbot-input:focus {
                outline: none;
                border-color: #0c70f2;
            }
            
            .farhanbot-send {
                background: #0c70f2;
                color: white;
                border: none;
                border-radius: 12px;
                padding: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 40px;
                height: 40px;
            }
            
            .farhanbot-send:hover {
                background: #0a5dd1;
                transform: translateY(-1px);
            }
            
            .farhanbot-send:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .farhanbot-quick-actions {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
            }
            
            .quick-action {
                background: #f1f5f9;
                color: #0a192f;
                border: none;
                border-radius: 8px;
                padding: 6px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
            }
            
            .quick-action:hover {
                background: #0c70f2;
                color: white;
                transform: translateY(-1px);
            }
            
            @media (max-width: 768px) {
                .farhanbot-chat {
                    width: calc(100vw - 40px);
                    height: 60vh;
                    bottom: 80px;
                    right: 20px;
                }
                
                .farhanbot-message {
                    max-width: 90%;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    bindEvents() {
        const toggle = document.getElementById('farhanbotToggle');
        const close = document.getElementById('farhanbotClose');
        const chat = document.getElementById('farhanbotChat');
        const input = document.getElementById('farhanbotInput');
        const send = document.getElementById('farhanbotSend');
        const quickActions = document.querySelectorAll('.quick-action');

        // Toggle chat
        toggle.addEventListener('click', () => {
            this.toggleChat();
        });

        // Close chat
        close.addEventListener('click', () => {
            this.closeChat();
        });

        // Send message
        send.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 100) + 'px';
        });

        // Quick actions
        quickActions.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Home link handler
        const homeLink = document.querySelector('.farhanbot-avatar-small');
        if (homeLink) {
            homeLink.addEventListener('click', (e) => {
                console.log('🧠 Home link clicked');
                // Ensure navigation works
                window.location.href = '/';
            });
        }
    }

    toggleChat() {
        const chat = document.getElementById('farhanbotChat');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chat.classList.add('open');
            document.getElementById('farhanbotInput').focus();
        } else {
            chat.classList.remove('open');
        }
    }

    closeChat() {
        const chat = document.getElementById('farhanbotChat');
        this.isOpen = false;
        chat.classList.remove('open');
    }

    addMessage(content, isUser = false) {
        const messages = document.getElementById('farhanbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `farhanbot-message ${isUser ? 'user' : 'bot'}`;
        messageDiv.innerHTML = content;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    showTyping() {
        const typing = document.getElementById('farhanbotTyping');
        typing.style.display = 'block';
        document.getElementById('farhanbotMessages').scrollTop = document.getElementById('farhanbotMessages').scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('farhanbotTyping');
        typing.style.display = 'none';
    }

    async sendMessage() {
        const input = document.getElementById('farhanbotInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage(message, true);
        input.value = '';
        input.style.height = 'auto';
        
        this.showTyping();
        
        // Check if this looks like a job description
        const isJobDescription = message.toLowerCase().includes('job') || 
                               message.toLowerCase().includes('position') || 
                               message.toLowerCase().includes('role') || 
                               message.toLowerCase().includes('requirements') ||
                               message.toLowerCase().includes('responsibilities') ||
                               message.length > 200; // Long text likely job description
        
        try {
            const endpoint = isJobDescription ? '/api/chatbot/analyze-job' : '/api/chatbot/chat';
            const body = isJobDescription ? 
                JSON.stringify({
                    job_description: message,
                    session_id: this.sessionId
                }) :
                JSON.stringify({
                    message: message,
                    session_id: this.sessionId
                });
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body
            });
            
            const data = await response.json();
            this.hideTyping();
            
            if (response.ok) {
                this.addMessage(data.response);
            } else {
                this.addMessage('Sorry, I encountered an error. Please try again.');
            }
        } catch (error) {
            this.hideTyping();
            this.addMessage('Sorry, I am having trouble connecting. Please try again.');
        }
    }

    handleQuickAction(action) {
        const questions = {
            'experience': 'What is Muhammad Farhan experience?',
            'skills': 'What are his top skills?',
            'projects': 'Tell me about his projects',
            'contact': 'How can I contact Muhammad Farhan?'
        };
        
        const question = questions[action];
        if (question) {
            this.addMessage(question, true);
            this.sendQuickQuestion(question);
        }
    }

    async sendQuickQuestion(question) {
        this.showTyping();
        
        try {
            const response = await fetch('/api/chatbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: question,
                    session_id: this.sessionId
                })
            });
            
            const data = await response.json();
            this.hideTyping();
            
            if (response.ok) {
                this.addMessage(data.response);
            } else {
                this.addMessage('Sorry, I encountered an error. Please try again.');
            }
        } catch (error) {
            this.hideTyping();
            this.addMessage('Sorry, I am having trouble connecting. Please try again.');
        }
    }
}

// Initialize FarhanBot Widget when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.farhanBot = new FarhanBotWidget();
}); 