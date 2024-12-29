import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
})
export class ChatBoxComponent implements OnInit {
  isChatOpen = false; // True when chat box is open
  currentMessage = '';

  constructor(public chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.clearOldMessages();
  }

  // Trigger message send on "Enter" key
  sendMessageOnEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  // Send message to backend and update chat
  sendMessage(): void {
    if (this.currentMessage.trim() === '') {
      return;
    }

    // Add the user's message to the chat
    this.chatService.addMessage({ sender: 'You', content: this.currentMessage });

    const userMessage = this.currentMessage; // Store the message to send
    this.currentMessage = ''; // Clear the input box

    // Call the backend for an AI response
    this.chatService.getChatAIResponse(userMessage).subscribe({
      next: (data) => {
        // Add the AI's response to the chat
        this.chatService.addMessage({ sender: 'Support', content: data.response });
        this.scrollToBottom(); // Scroll to the bottom of the chat
      },
      error: (err) => {
        console.error('Error:', err);
        // Show an error message in the chat
        this.chatService.addMessage({
          sender: 'Support',
          content: 'Sorry, something went wrong. Please try again later.',
        });
        this.scrollToBottom(); // Scroll to the bottom
      },
    });
  }

  // Toggle chat visibility
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  // Get all messages
  get messages() {
    return this.chatService.messages;
  }

  // Scroll to the bottom of the chat
  scrollToBottom(): void {
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 0);
  }
}
