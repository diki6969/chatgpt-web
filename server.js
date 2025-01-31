<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Neon Chat Pro</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root {
            --neon-blue: #00f3ff;
            --dark-bg: #0a0a0f;
            --text-primary: rgba(255,255,255,0.95);
            --menu-width: 240px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background: var(--dark-bg);
            font-family: 'Courier New', monospace;
            color: var(--text-primary);
            height: 100vh;
            overflow: hidden;
            touch-action: manipulation;
        }

        /* Navigation Styles */
        .nav-container {
            position: fixed;
            left: -100%;
            top: 0;
            width: var(--menu-width);
            height: 100%;
            background: rgba(10,10,15,0.98);
            border-right: 2px solid var(--neon-blue);
            box-shadow: 0 0 25px rgba(0,243,255,0.2);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
        }

        .nav-container.active {
            left: 0;
        }

        .nav-header {
            padding: 1.2rem;
            border-bottom: 1px solid var(--neon-blue);
        }

        .nav-links {
            padding: 1rem;
        }

        .nav-link {
            display: flex;
            align-items: center;
            padding: 12px;
            margin: 8px 0;
            color: var(--neon-blue);
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.3s ease;
        }

        .nav-link:hover {
            background: rgba(0,243,255,0.1);
            transform: translateX(5px);
        }

        .nav-link i {
            width: 30px;
            font-size: 1.2rem;
        }

        /* Chat Container */
        .chat-wrapper {
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: radial-gradient(ellipse at center, #0f0f1a 0%, #0a0a0f 100%);
        }

        /* Chat Header */
        .chat-header {
            display: flex;
            align-items: center;
            padding: 0.8rem 1rem;
            background: rgba(0,0,0,0.3);
            border-bottom: 1px solid var(--neon-blue);
            box-shadow: 0 0 15px rgba(0,243,255,0.1);
        }

        .menu-toggle {
            width: 30px;
            height: 22px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            cursor: pointer;
            margin-right: 1rem;
        }

        .menu-toggle span {
            height: 2px;
            background: var(--neon-blue);
            box-shadow: 0 0 5px var(--neon-blue);
            transition: all 0.3s ease;
        }

        .chat-title {
            font-size: 1.1rem;
            text-shadow: 0 0 10px var(--neon-blue);
        }

        /* Chat Messages Area */
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        /* Message Bubbles */
        .message {
            max-width: 85%;
            padding: 10px 15px;
            border-radius: 15px;
            animation: messagePop 0.3s ease;
            position: relative;
            word-break: break-word;
            line-height: 1.4;
        }

        .user-message {
            background: linear-gradient(135deg, #006666 0%, #009999 100%);
            align-self: flex-end;
            border: 1px solid var(--neon-blue);
            box-shadow: 0 0 10px rgba(0,243,255,0.3);
        }

        .bot-message {
            background: rgba(15,15,25,0.9);
            align-self: flex-start;
            border: 1px solid #2a2a3a;
            box-shadow: 0 0 10px rgba(0,243,255,0.1);
        }

        /* JSON Formatting */
        .json-response {
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            padding: 12px;
            margin: 8px 0;
            border-radius: 8px;
            background: rgba(0,0,0,0.3);
            border: 1px solid #2a2a3a;
            color: #7fffd4;
        }

        .json-key { color: #00f3ff; }
        .json-string { color: #ff99cc; }
        .json-brace { color: #ffff99; }

        /* Input Area */
        .input-container {
            display: flex;
            gap: 10px;
            padding: 1rem;
            background: rgba(0,0,0,0.4);
            border-top: 1px solid var(--neon-blue);
        }

        .message-input {
            flex: 1;
            padding: 12px 18px;
            border: none;
            border-radius: 25px;
            background: rgba(255,255,255,0.05);
            color: var(--neon-blue);
            font-size: 14px;
            caret-color: var(--neon-blue);
        }

        .message-input::placeholder {
            color: #4d4d5a;
        }

        .send-btn {
            width: 45px;
            height: 45px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #009999 0%, #00cccc 100%);
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .send-btn:hover {
            transform: rotate(90deg) scale(1.1);
            box-shadow: 0 0 15px var(--neon-blue);
        }

        /* Typing Indicator */
        .typing-indicator {
            display: inline-flex;
            padding: 10px 15px;
            background: rgba(15,15,25,0.9);
            border-radius: 15px;
            gap: 6px;
        }

        .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--neon-blue);
            border-radius: 50%;
            animation: dotBounce 1.4s infinite ease-in-out;
        }

        /* Animations */
        @keyframes messagePop {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes dotBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
            width: 6px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--neon-blue);
            border-radius: 3px;
        }

        /* Mobile Optimization */
        @media (max-width: 480px) {
            .message {
                max-width: 90%;
                padding: 8px 12px;
                font-size: 13px;
            }

            .message-input {
                padding: 10px 15px;
                font-size: 13px;
            }

            .send-btn {
                width: 40px;
                height: 40px;
            }

            .json-response {
                font-size: 12px;
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation Menu -->
    <nav class="nav-container">
        <div class="nav-header">
            <h3 style="color: var(--neon-blue);">Menu</h3>
        </div>
        <div class="nav-links">
            <a href="#" class="nav-link" onclick="openSocial('whatsapp')">
                <i class="fab fa-whatsapp"></i>
                WhatsApp
            </a>
            <a href="#" class="nav-link" onclick="openSocial('instagram')">
                <i class="fab fa-instagram"></i>
                Instagram
            </a>
        </div>
    </nav>

    <!-- Chat Interface -->
    <div class="chat-wrapper">
        <header class="chat-header">
            <div class="menu-toggle" onclick="toggleMenu()">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <h1 class="chat-title">NEON CHAT</h1>
        </header>

        <main class="chat-messages" id="chatMessages"></main>

        <div class="input-container">
            <input type="text" class="message-input" id="userInput" placeholder="Ketik pesan..." autocomplete="off">
            <button class="send-btn" onclick="sendMessage()">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    </div>

    <script>
        // Navigation Functions
        function toggleMenu() {
            document.querySelector('.nav-container').classList.toggle('active');
        }

        function openSocial(type) {
            const urls = {
                whatsapp: 'https://wa.me/yournumber',
                instagram: 'https://instagram.com/yourusername'
            };
            window.open(urls[type], '_blank');
            toggleMenu();
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && 
                !e.target.closest('.menu-toggle')) {
                document.querySelector('.nav-container').classList.remove('active');
            }
        });

        // Chat Functions
        const chatMessages = document.getElementById('chatMessages');
        const userInput = document.getElementById('userInput');
        let isBotTyping = false;

        function createTypingIndicator() {
            const container = document.createElement('div');
            container.className = 'message bot-message typing-indicator';
            
            for(let i = 0; i < 3; i++) {
                const dot = document.createElement('div');
                dot.className = 'typing-dot';
                dot.style.animationDelay = `${i * 0.2}s`;
                container.appendChild(dot);
            }
            
            return container;
        }

        function formatJSON(text) {
            try {
                // Basic JSON syntax highlighting
                return text
                    .replace(/("[\w]+":)/g, '<span class="json-key">$1</span>')
                    .replace(/("[^"]*")/g, '<span class="json-string">$1</span>')
                    .replace(/({|}|\[|\])/g, '<span class="json-brace">$1</span>')
                    .replace(/\\n/g, '<br>')
                    .replace(/\\t/g, '&nbsp;&nbsp;');
            } catch(e) {
                return text;
            }
        }

        async function sendMessage() {
            const message = userInput.value.trim();
            if (!message || isBotTyping) return;

            // Add user message
            const userDiv = document.createElement('div');
            userDiv.className = 'message user-message';
            userDiv.textContent = message;
            chatMessages.appendChild(userDiv);
            
            userInput.value = '';
            scrollToBottom();

            // Show typing indicator
            isBotTyping = true;
            const typing = createTypingIndicator();
            chatMessages.appendChild(typing);
            scrollToBottom();

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });

                const data = await response.json();
                typing.remove();

                // Create bot message
                const botDiv = document.createElement('div');
                botDiv.className = 'message bot-message';

                // Check if response contains JSON
                if (data.reply.includes('{') || data.reply.includes('[')) {
                    const pre = document.createElement('pre');
                    pre.className = 'json-response';
                    pre.innerHTML = formatJSON(data.reply);
                    botDiv.appendChild(pre);
                } else {
                    botDiv.textContent = data.reply.replace(/\\n/g, '\n');
                }

                chatMessages.appendChild(botDiv);
                scrollToBottom();

            } catch (error) {
                typing.remove();
                const errorDiv = document.createElement('div');
                errorDiv.className = 'message bot-message';
                errorDiv.textContent = '⚠️ Gagal terhubung ke server';
                chatMessages.appendChild(errorDiv);
                scrollToBottom();
            } finally {
                isBotTyping = false;
            }
        }

        function scrollToBottom() {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Event Listeners
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Initial focus
        window.addEventListener('load', () => {
            userInput.focus();
        });
    </script>
</body>
</html>
