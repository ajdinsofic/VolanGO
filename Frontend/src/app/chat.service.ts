import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly _messages: { sender: string; content: string; timestamp: number }[] = [];
  private readonly apiUrl = 'http://localhost:5136/api/chat/send-message'; // Backend API URL
  private readonly storageKey = 'chatMessages';
  private readonly oneHour = 60000; // One hour in milliseconds

  constructor(private http: HttpClient) {
    // Load messages from localStorage and remove messages older than one hour
    const savedMessages = localStorage.getItem(this.storageKey);
    if (savedMessages) {
      const now = Date.now();
      const messages = JSON.parse(savedMessages) as { sender: string; content: string; timestamp: number }[];
      this._messages.push(...messages.filter((msg) => now - msg.timestamp < this.oneHour)); // Keep only messages from the last hour
      this.saveMessages(); // Save the filtered messages back to localStorage
    }
  }

  // Getter for messages
  get messages(): { sender: string; content: string; timestamp: number }[] {
    return this._messages;
  }

  // Add a new message with a timestamp
  addMessage(message: { sender: string; content: string }): void {
    const timestamp = Date.now(); // Add timestamp to the message
    this._messages.push({ ...message, timestamp });
    this.saveMessages(); // Save updated messages to localStorage
  }

  // Communicate with the backend to get a response from OpenAI
  getChatAIResponse(userMessage: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(this.apiUrl, { message: userMessage });
  }

  // Save messages to localStorage
  private saveMessages(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this._messages));
  }

  // Clear messages older than one hour (can be called manually if needed)
  clearOldMessages(): void {
    const now = Date.now();
    const filteredMessages = this._messages.filter((msg) => now - msg.timestamp < this.oneHour);
    this._messages.length = 0; // Clear the array
    this._messages.push(...filteredMessages); // Add back filtered messages
    this.saveMessages(); // Save updated messages to localStorage
  }
}
