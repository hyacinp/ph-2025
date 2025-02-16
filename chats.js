// ... existing code ...

function initializeCompose() {
    const composeBtn = document.querySelector('.compose-btn');
    
    composeBtn.addEventListener('click', () => {
        // Clear any active chat states
        const activeChats = document.querySelectorAll('.chat-item.active');
        activeChats.forEach(chat => chat.classList.remove('active'));
        
        // Update the main chat area
        const chatMain = document.querySelector('.chat-main');
        chatMain.innerHTML = `
            <div class="chat-header">
                <div class="partner-info">
                    <input type="text" 
                           class="new-chat-input" 
                           placeholder="Enter username to start a chat..."
                           style="padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; width: 300px;">
                </div>
            </div>
            <div class="messages-container">
                <!-- Messages will appear here -->
            </div>
            <div class="message-input-container">
                <input type="text" class="message-input" placeholder="Type a message..." disabled>
                <button class="send-button" disabled>Send</button>
            </div>
        `;

        // Add event listener for the new chat input
        const newChatInput = document.querySelector('.new-chat-input');
        newChatInput.addEventListener('input', (e) => {
            const messageInput = document.querySelector('.message-input');
            const sendButton = document.querySelector('.send-button');
            
            // Enable/disable message input based on whether a username is entered
            if (e.target.value.trim()) {
                messageInput.disabled = false;
                sendButton.disabled = false;
            } else {
                messageInput.disabled = true;
                sendButton.disabled = true;
            }
        });
    });
}

// Call this function when your page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCompose();
    // ... your other initialization code ...
});