import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Optional, remove if not used in template
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService for logout

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // Keep CommonModule if used, otherwise remove
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  features = [
    { name: 'Weather Forecasting', route: '/weather', icon: '☀️' },
    { name: 'Product Listing', route: '/products', icon: '🛒' },
    { name: 'Markets & Dealers', route: '/markets', icon: '🏬' },
    { name: 'Chatting', route: '/chat', icon: '💬' },
    { name: 'Group Chatting', route: '/group-chat', icon: '👥' },
    { name: 'Govt Official Chatting', route: '/govt-chat', icon: '🏛️' },
    { name: 'Post Sharing', route: '/posts', icon: '📸' }
  ];

  constructor(private authService: AuthService) {} // Inject AuthService

  logout() {
    this.authService.logout(); // Clear the token
    window.location.href = '/login'; // Redirect to login page (use Router for Angular navigation if preferred)
  }
}