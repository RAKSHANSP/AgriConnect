import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  user = { name: '', role: '', email: '', password: '' }; // Ensure initial values are empty

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.auth.signup(this.user);
  }
}