// ============ DOM ELEMENTS ============
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chatBox');
const clearBtn = document.getElementById('clearBtn');
const infoBtn = document.getElementById('infoBtn');
const typingIndicator = document.getElementById('typingIndicator');
const infoModal = document.getElementById('infoModal');

// ============ CHAT STATE ============
const chatState = {
    messages: [],
    isTyping: false,
    currentUserName: 'You',
    botName: 'ChatBot',
    replyDelay: 800, // ms before bot replies
    typingDuration: 1200 // ms for typing animation
};

// ============ BOT RESPONSES ============
const botResponses = {
    greetings: [
        "Hello! 👋 How's everything going?",
        "Hey there! 😊 What can I help you with?",
        "Greetings! 🙌 How are you doing today?"
    ],
    howAreYou: [
        "I'm doing great, thanks for asking! 💪",
        "Doing fantastic! Ready to chat. 🎉",
        "I'm in top form! How about you? 😄"
    ],
    jokes: [
        "Why don't scientists trust atoms? Because they make up everything! 😄",
        "What do you call fake spaghetti? An impasta! 🍝😆",
        "Why did the scarecrow win an award? He was outstanding in his field! 🌾😂",
        "What do you call a bear with no teeth? A gummy bear! 🐻😄",
        "Why don't eggs tell jokes? They'd crack each other up! 🥚😂"
    ],
    help: [
        "I'm here to chat and keep you company! 💬",
        "You can ask me anything, send quick replies, or just have a conversation! 🤖",
        "I can chat about almost anything, tell jokes, or just listen. What's on your mind? 👂"
    ],
    thanks: [
        "You're welcome! 😊 Happy to help!",
        "Anytime! Glad I could help. 🙌",
        "No problem at all! Feel free to ask anything else. 💬"
    ],
    bye: [
        "Goodbye! 👋 Come back soon!",
        "See you later! Take care! 😊",
        "It was nice chatting with you! Catch you soon! 🚀"
    ],
    default: [
        "That's interesting! Tell me more. 🤔",
        "I see! That's cool. 😊",
        "Absolutely! Keep going, I'm interested. 👂",
        "Nice thought! Anything else? 💭",
        "That sounds great! What else? 🌟",
        "Got it! I'm listening... 📖"
    ]
};

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
    setupEventListeners();
});

// ============ EVENT LISTENERS ============
function setupEventListeners() {
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    clearBtn.addEventListener('click', clearChat);
    infoBtn.addEventListener('click', openInfo);
    
    // Close modal when clicking outside
    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            closeInfo();
        }
    });
}

// ============ SEND MESSAGE ============
function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (!messageText) {
        messageInput.focus();
        return;
    }
    
    // Add user message
    addMessage(messageText, 'user');
    
    // Clear input
    messageInput.value = '';
    messageInput.focus();
    
    // Save to history
    saveChatHistory();
    
    // Simulate bot typing and reply
    showTypingIndicator();
    
    setTimeout(() => {
        const botReply = generateBotReply(messageText);
        hideTypingIndicator();
        addMessage(botReply, 'bot');
        saveChatHistory();
    }, chatState.replyDelay);
}

// ============ QUICK REPLY ============
function sendQuickReply(text) {
    messageInput.value = text;
    sendMessage();
}

// ============ ADD MESSAGE TO CHAT ============
function addMessage(text, sender) {
    // Create message group
    const messageGroup = document.createElement('div');
    messageGroup.classList.add('message-group', `${sender}-message`);
    
    // Create avatar
    const avatar = document.createElement('div');
    avatar.classList.add('message-avatar');
    avatar.textContent = sender === 'user' ? '👤' : '🤖';
    
    // Create message content wrapper
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    
    // Create message bubble
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message', sender);
    
    const para = document.createElement('p');
    para.textContent = text;
    messageBubble.appendChild(para);
    
    // Create timestamp
    const timestamp = document.createElement('span');
    timestamp.classList.add('message-time');
    timestamp.textContent = getTimeString();
    
    // Append to message content
    messageContent.appendChild(messageBubble);
    messageContent.appendChild(timestamp);
    
    // Append avatar and content to message group
    messageGroup.appendChild(avatar);
    messageGroup.appendChild(messageContent);
    
    // Add to chat box
    chatBox.appendChild(messageGroup);
    
    // Auto scroll to latest message
    scrollToBottom();
    
    // Store in state
    chatState.messages.push({
        text: text,
        sender: sender,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
}

// ============ GENERATE BOT REPLY ============
function generateBotReply(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for keywords and respond with appropriate category
    if (matchesKeywords(lowerMessage, ['hello', 'hi', 'hey', 'greetings', 'sup'])) {
        return getRandomItem(botResponses.greetings);
    }
    
    if (matchesKeywords(lowerMessage, ['how are you', 'how you doing', 'how have you been'])) {
        return getRandomItem(botResponses.howAreYou);
    }
    
    if (matchesKeywords(lowerMessage, ['joke', 'make me laugh', 'funny', 'something funny', 'laugh'])) {
        return getRandomItem(botResponses.jokes);
    }
    
    if (matchesKeywords(lowerMessage, ['help', 'can you help', 'what can you do'])) {
        return getRandomItem(botResponses.help);
    }
    
    if (matchesKeywords(lowerMessage, ['thank', 'thanks', 'thank you', 'appreciate', 'thx'])) {
        return getRandomItem(botResponses.thanks);
    }
    
    if (matchesKeywords(lowerMessage, ['bye', 'goodbye', 'see you', 'take care', 'farewell'])) {
        return getRandomItem(botResponses.bye);
    }
    
    if (matchesKeywords(lowerMessage, ['what\'s your name', 'who are you', 'your name'])) {
        return `I'm ${chatState.botName}, your chat companion! 🤖 Where are you from?`;
    }
    
    if (matchesKeywords(lowerMessage, ['what time is it', 'time'])) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
        return `It's ${timeStr} right now! ⏰`;
    }
    
    if (matchesKeywords(lowerMessage, ['what day is it', 'date', 'today'])) {
        const now = new Date();
        const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
        return `Today is ${dateStr}! 📅`;
    }
    
    // Default response
    return getRandomItem(botResponses.default);
}

// ============ UTILITY FUNCTIONS ============
function matchesKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getTimeString() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    // Return relative time for current hour
    const currentHour = now.getHours();
    if (currentHour === new Date(Date.now() - 60000).getHours()) {
        return 'just now';
    }
    
    return timeStr;
}

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
    typingIndicator.classList.add('active');
    scrollToBottom();
}

function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
}

// ============ CLEAR CHAT ============
function clearChat() {
    const confirmed = confirm('Are you sure you want to clear the entire chat history?');
    
    if (confirmed) {
        chatBox.innerHTML = `
            <div class="message-group bot-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="message bot">
                        <p>Chat cleared! 🧹 Let's start fresh. How can I help you?</p>
                    </div>
                    <span class="message-time">just now</span>
                </div>
            </div>
        `;
        chatState.messages = [];
        localStorage.removeItem('chatHistory');
        scrollToBottom();
    }
}

// ============ LOCAL STORAGE ============
function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatState.messages));
}

function loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    
    if (saved) {
        try {
            const messages = JSON.parse(saved);
            chatState.messages = messages;
            
            // Clear initial message and reload all saved messages
            chatBox.innerHTML = '';
            
            messages.forEach(msg => {
                const messageGroup = document.createElement('div');
                messageGroup.classList.add('message-group', `${msg.sender}-message`);
                
                const avatar = document.createElement('div');
                avatar.classList.add('message-avatar');
                avatar.textContent = msg.sender === 'user' ? '👤' : '🤖';
                
                const messageContent = document.createElement('div');
                messageContent.classList.add('message-content');
                
                const messageBubble = document.createElement('div');
                messageBubble.classList.add('message', msg.sender);
                const para = document.createElement('p');
                para.textContent = msg.text;
                messageBubble.appendChild(para);
                
                const timestamp = document.createElement('span');
                timestamp.classList.add('message-time');
                timestamp.textContent = msg.timestamp;
                
                messageContent.appendChild(messageBubble);
                messageContent.appendChild(timestamp);
                messageGroup.appendChild(avatar);
                messageGroup.appendChild(messageContent);
                
                chatBox.appendChild(messageGroup);
            });
            
            scrollToBottom();
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }
}

// ============ INFO MODAL ============
function openInfo() {
    infoModal.classList.add('active');
}

function closeInfo() {
    infoModal.classList.remove('active');
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeInfo();
    }
});
