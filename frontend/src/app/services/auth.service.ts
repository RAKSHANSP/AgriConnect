import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api'; // Your backend URL
  private tokenKey = 'auth_token'; // Key for storing token in localStorage

  constructor(private http: HttpClient) {}

  // Signup method with name and role
  signup(user: { name: string; email: string; password: string; role: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/signup`, user);
  }

  // Login method
  login(user: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, user);
  }

  // Store token after successful login/signup
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check authentication status
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Logout method
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}