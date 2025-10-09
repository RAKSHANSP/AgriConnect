import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GroupMessage {
  _id: string;
  sender: { _id: string; name: string; role: string }; // Added _id for comparison
  text: string;
  sentDate: Date;
}

@Component({
  selector: 'app-group-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-chat.html',
  styleUrls: ['./group-chat.css']
})
export class GroupChatComponent implements OnInit {
  messages: GroupMessage[] = [];
  newMessageText: string = '';
  token = localStorage.getItem('token') || '';
  userId: string = ''; // Add userId for sent message check
  groupId = 'global'; // Default group

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userId = this.getUserIdFromToken(); // Fetch userId from token
    this.loadMessages();
  }

  getUserIdFromToken(): string {
    if (this.token) {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return payload.userId;
    }
    return '';
  }

  loadMessages() {
    this.http.get<GroupMessage[]>(`http://localhost:5000/group-messages/${this.groupId}`)
      .subscribe({
        next: (data) => this.messages = data,
        error: (err) => alert(err.error.message || 'Error loading messages')
      });
  }

  sendMessage() {
    if (!this.newMessageText.trim()) {
      alert('Message cannot be empty');
      return;
    }
    this.http.post('http://localhost:5000/group-messages', { text: this.newMessageText.trim(), groupId: this.groupId }, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        this.newMessageText = '';
        this.loadMessages(); // Refresh feed
      },
      error: (err) => alert(err.error.message || 'Error sending message')
    });
  }

  deleteOwnMessage(messageId: string) {
    if (confirm('Delete this message?')) {
      this.http.delete(`http://localhost:5000/group-messages/${messageId}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).subscribe({
        next: () => {
          this.loadMessages();
          alert('Message deleted!');
        },
        error: (err) => alert('Error deleting message')
      });
    }
  }

  isOwnMessage(msg: GroupMessage): boolean {
    return msg.sender._id === this.userId; // Now _id is defined in interface
  }
}