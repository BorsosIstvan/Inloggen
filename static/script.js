document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messageContainer = document.getElementById('message-container');

    messageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const messageText = messageInput.value;
        // Send message to server or handle message sending logic here
        console.log(`Sending message: ${messageText}`);
        messageInput.value = '';
    });
});
