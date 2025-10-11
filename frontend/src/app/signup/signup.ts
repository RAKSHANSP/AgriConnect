import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';   // ✅ Add this
import { AuthService } from '../auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],   // ✅ Include CommonModule here
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  user = { name: '', role: '', email: '', password: '' };

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.auth.signup(this.user);
  }
}
