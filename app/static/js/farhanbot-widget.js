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
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.id = 'farhanbot-widget';
        widget.innerHTML = `
            <div class="farhanbot-toggle" id="farhanbotToggle">
                <div class="farhanbot-toggle-icon">🧠</div>
                <div class="farhanbot-label">Farhan.AI</div>
            </div>

            <div class="farhanbot-chat" id="farhanbotChat">
                <div class="farhanbot-header">
                    <div class="farhanbot-title">
                        <div class="farhanbot-avatar-small">🧠</div>
                        <div>
                            <h3>Farhan.AI</h3>
                            <p>Portfolio Intelligence</p>
                        </div>
                    </div>
                    <div class="farhanbot-header-actions">
                        <a href="/chatbot" class="farhanbot-expand" title="Open full chat">
                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                        </a>
                        <button class="farhanbot-close" id="farhanbotClose">
                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="farhanbot-messages" id="farhanbotMessages">
                    <div class="farhanbot-message bot">
                        <strong>👋 Hi — I'm Farhan.AI.</strong><br><br>
                        Ask me about Muhammad Farhan's skills, experience, or projects. Or paste a job description and I'll analyse the fit.<br><br>
                        <span class="fb-hint">Use the prompts below or type your own →</span>
                    </div>
                </div>

                <div class="farhanbot-typing" id="farhanbotTyping">
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>

                <div class="farhanbot-input-container">
                    <div class="farhanbot-input-wrapper">
                        <textarea
                            class="farhanbot-input"
                            id="farhanbotInput"
                            placeholder="Ask about skills, projects, availability…"
                            rows="1"
                        ></textarea>
                        <button class="farhanbot-send" id="farhanbotSend">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
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
                font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            /* ── Toggle pill ── */
            .farhanbot-toggle {
                background: #0c70f2;
                color: #ffffff;
                padding: 12px 20px;
                border-radius: 50px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 9px;
                border: 1px solid rgba(255,255,255,0.2);
                box-shadow: 0 4px 18px rgba(12,112,242,0.45);
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                font-weight: 600;
                font-size: 14.5px;
                user-select: none;
            }

            .farhanbot-toggle:hover {
                transform: translateY(-2px);
                background: #0a5dd1;
                box-shadow: 0 6px 26px rgba(12,112,242,0.58);
            }

            .farhanbot-toggle-icon {
                width: 27px;
                height: 27px;
                background: rgba(255,255,255,0.18);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 15px;
            }

            /* ── Chat popup ── */
            .farhanbot-chat {
                position: absolute;
                bottom: 68px;
                right: 0;
                width: 400px;
                height: 570px;
                background: #ffffff;
                border-radius: 18px;
                box-shadow: 0 24px 60px rgba(10,25,47,0.22), 0 0 0 1px rgba(0,0,0,0.06);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .farhanbot-chat.open {
                display: flex;
                animation: fb-slide-in 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
            }

            @keyframes fb-slide-in {
                from { opacity: 0; transform: translateY(14px) scale(0.96); }
                to   { opacity: 1; transform: none; }
            }

            /* ── Header ── */
            .farhanbot-header {
                background: #ffffff;
                padding: 13px 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #e2e8f0;
                box-shadow: 0 1px 4px rgba(0,0,0,0.05);
                flex-shrink: 0;
            }

            .farhanbot-title {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .farhanbot-avatar-small {
                width: 36px;
                height: 36px;
                background: #0c70f2;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 17px;
                flex-shrink: 0;
            }

            .farhanbot-title h3 {
                margin: 0;
                font-family: 'Bricolage Grotesque', 'DM Sans', sans-serif;
                font-weight: 800;
                font-size: 14px;
                color: #0a192f;
                line-height: 1.2;
            }

            .farhanbot-title p {
                margin: 2px 0 0;
                font-size: 11px;
                color: #64748b;
            }

            .farhanbot-header-actions {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .farhanbot-expand {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                border-radius: 7px;
                background: #f1f5f9;
                border: 1px solid #e2e8f0;
                color: #64748b;
                text-decoration: none;
                transition: all 0.18s;
                cursor: pointer;
            }

            .farhanbot-expand:hover {
                color: #0c70f2;
                background: rgba(12,112,242,0.07);
                border-color: rgba(12,112,242,0.22);
            }

            .farhanbot-close {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                border-radius: 7px;
                background: #f1f5f9;
                border: 1px solid #e2e8f0;
                color: #64748b;
                cursor: pointer;
                transition: all 0.18s;
            }

            .farhanbot-close:hover {
                background: #fee2e2;
                color: #ef4444;
                border-color: #fecaca;
            }

            /* ── Messages area ── */
            .farhanbot-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
                background: #f1f5f9;
            }

            .farhanbot-messages::-webkit-scrollbar { width: 3px; }
            .farhanbot-messages::-webkit-scrollbar-track { background: transparent; }
            .farhanbot-messages::-webkit-scrollbar-thumb {
                background: #e2e8f0;
                border-radius: 2px;
            }

            .farhanbot-message {
                max-width: 87%;
                padding: 11px 14px;
                border-radius: 14px;
                font-size: 13.5px;
                line-height: 1.62;
                word-break: break-word;
                animation: fb-msg-in 0.24s cubic-bezier(0.34, 1.4, 0.64, 1) both;
            }

            @keyframes fb-msg-in {
                from { opacity: 0; transform: translateY(6px) scale(0.97); }
                to   { opacity: 1; transform: none; }
            }

            .farhanbot-message.user {
                background: linear-gradient(135deg, #0c70f2, #0a5dd1);
                color: #fff;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
                font-weight: 500;
                box-shadow: 0 3px 12px rgba(12,112,242,0.28);
            }

            .farhanbot-message.bot {
                background: #ffffff;
                color: #0a192f;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }

            .farhanbot-message.bot strong { color: #0c70f2; }

            .farhanbot-message.bot a {
                color: #0c70f2;
                text-decoration: none;
                border-bottom: 1px solid rgba(12,112,242,0.3);
                transition: color .18s;
            }

            .farhanbot-message.bot a:hover { color: #0a5dd1; }

            .farhanbot-message.bot br { display: block; margin: 4px 0; }

            .fb-hint {
                font-size: 11px;
                color: #94a3b8;
            }

            /* ── Typing ── */
            .farhanbot-typing {
                display: none;
                align-self: flex-start;
                padding: 11px 15px;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 14px;
                border-bottom-left-radius: 4px;
                margin: 0 16px 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }

            .typing-dots { display: flex; gap: 4px; align-items: center; }

            .typing-dots span {
                width: 7px;
                height: 7px;
                background: #cbd5e1;
                border-radius: 50%;
                animation: fb-dot 1.25s ease-in-out infinite;
            }

            .typing-dots span:nth-child(1) { animation-delay: 0s; }
            .typing-dots span:nth-child(2) { animation-delay: 0.18s; }
            .typing-dots span:nth-child(3) { animation-delay: 0.36s; }

            @keyframes fb-dot {
                0%,60%,100% { transform: translateY(0);   background: #cbd5e1; }
                30%          { transform: translateY(-5px); background: #0c70f2; }
            }

            /* ── Input container ── */
            .farhanbot-input-container {
                padding: 11px 14px 14px;
                border-top: 1px solid #e2e8f0;
                background: #ffffff;
                flex-shrink: 0;
            }

            .farhanbot-input-wrapper {
                display: flex;
                gap: 8px;
                align-items: flex-end;
                background: #f1f5f9;
                border: 1.5px solid #e2e8f0;
                border-radius: 12px;
                padding: 6px 6px 6px 12px;
                margin-bottom: 9px;
                transition: border-color .2s, box-shadow .2s;
            }

            .farhanbot-input-wrapper:focus-within {
                border-color: #cbd5e1;
                background: #fff;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }

            .farhanbot-input {
                flex: 1;
                background: transparent;
                border: none;
                outline: none;
                color: #0a192f;
                font-family: 'DM Sans', sans-serif;
                font-size: 13.5px;
                resize: none;
                min-height: 30px;
                max-height: 88px;
                padding: 4px 0;
                caret-color: #0c70f2;
                line-height: 1.45;
            }

            .farhanbot-input::placeholder { color: #94a3b8; }

            .farhanbot-send {
                flex-shrink: 0;
                width: 34px;
                height: 34px;
                border-radius: 8px;
                background: #0c70f2;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                transition: all .18s;
                box-shadow: 0 2px 8px rgba(12,112,242,0.3);
            }

            .farhanbot-send:hover:not(:disabled) {
                background: #0a5dd1;
                transform: scale(1.06);
                box-shadow: 0 4px 14px rgba(12,112,242,0.4);
            }

            .farhanbot-send:disabled { opacity: 0.38; cursor: not-allowed; transform: none; box-shadow: none; }

            /* ── Quick action chips ── */
            .farhanbot-quick-actions { display: flex; gap: 5px; flex-wrap: wrap; }

            .quick-action {
                font-family: 'DM Sans', sans-serif;
                font-size: 11.5px;
                font-weight: 500;
                color: #0c70f2;
                background: rgba(12,112,242,0.07);
                border: 1px solid rgba(12,112,242,0.2);
                border-radius: 20px;
                padding: 4px 11px;
                cursor: pointer;
                transition: all .18s;
            }

            .quick-action:hover {
                background: #0c70f2;
                color: #fff;
                border-color: #0c70f2;
            }

            /* ── Mobile ── */
            @media (max-width: 600px) {
                #farhanbot-widget { bottom: 12px; right: 12px; }

                .farhanbot-chat {
                    position: fixed !important;
                    bottom: 72px;
                    right: 12px;
                    left: 12px;
                    width: auto;
                    height: 68vh;
                    max-height: 530px;
                    border-radius: 16px;
                }

                .farhanbot-label { display: none; }

                .farhanbot-messages { padding: 13px; gap: 9px; }

                .farhanbot-message { max-width: 92%; font-size: 13px; padding: 10px 12px; }

                .farhanbot-input-container { padding: 10px 13px 13px; }

                .farhanbot-toggle { padding: 10px 16px; font-size: 13.5px; }
            }
        `;

        document.head.appendChild(styles);
    }

    bindEvents() {
        const toggle = document.getElementById('farhanbotToggle');
        const close  = document.getElementById('farhanbotClose');
        const input  = document.getElementById('farhanbotInput');
        const send   = document.getElementById('farhanbotSend');
        const quickActions = document.querySelectorAll('.quick-action');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click',  () => this.closeChat());
        send.addEventListener('click',   () => this.sendMessage());

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMessage(); }
        });

        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 88) + 'px';
        });

        quickActions.forEach(btn => {
            btn.addEventListener('click', () => this.handleQuickAction(btn.dataset.action));
        });
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
        document.getElementById('farhanbotChat').classList.remove('open');
        this.isOpen = false;
    }

    addMessage(content, isUser = false) {
        const messages = document.getElementById('farhanbotMessages');
        const div = document.createElement('div');
        div.className = `farhanbot-message ${isUser ? 'user' : 'bot'}`;
        div.innerHTML = content;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    showTyping() {
        const t = document.getElementById('farhanbotTyping');
        t.style.display = 'block';
        document.getElementById('farhanbotMessages').scrollTop = 99999;
    }

    hideTyping() {
        document.getElementById('farhanbotTyping').style.display = 'none';
    }

    async sendMessage() {
        const input   = document.getElementById('farhanbotInput');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage(message, true);
        input.value = '';
        input.style.height = 'auto';
        this.showTyping();

        const isJob = message.toLowerCase().includes('job') ||
            message.toLowerCase().includes('position') ||
            message.toLowerCase().includes('role') ||
            message.toLowerCase().includes('requirements') ||
            message.toLowerCase().includes('responsibilities') ||
            message.length > 200;

        try {
            const endpoint = isJob ? '/api/chatbot/analyze-job' : '/api/chatbot/chat';
            const body = isJob
                ? JSON.stringify({ job_description: message, session_id: this.sessionId })
                : JSON.stringify({ message: message, session_id: this.sessionId });

            const res  = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
            const data = await res.json();
            this.hideTyping();
            this.addMessage(res.ok ? data.response : 'Sorry, I encountered an error. Please try again.');
        } catch {
            this.hideTyping();
            this.addMessage('Sorry, I\'m having trouble connecting. Please try again.');
        }
    }

    handleQuickAction(action) {
        const questions = {
            experience: "What is Muhammad Farhan's experience?",
            skills:     "What are his top technical skills?",
            projects:   "Tell me about his key projects.",
            contact:    "How can I contact Muhammad Farhan?"
        };
        const q = questions[action];
        if (q) { this.addMessage(q, true); this.sendQuickQuestion(q); }
    }

    async sendQuickQuestion(question) {
        this.showTyping();
        try {
            const res  = await fetch('/api/chatbot/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: question, session_id: this.sessionId })
            });
            const data = await res.json();
            this.hideTyping();
            this.addMessage(res.ok ? data.response : 'Sorry, I encountered an error. Please try again.');
        } catch {
            this.hideTyping();
            this.addMessage('Sorry, I\'m having trouble connecting. Please try again.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.farhanBot = new FarhanBotWidget();
});
