import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  signup(user: any) {
    return this.http.post('http://localhost:5000/signup', user).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => alert(err.error.message) // Show error message
    });
  }

  login(credentials: any): Observable<any> {
    return this.http.post('http://localhost:5000/login', credentials);
  }
}