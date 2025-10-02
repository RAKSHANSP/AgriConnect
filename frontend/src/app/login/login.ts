import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  credentials = { email: '', password: '' }; // Ensure initial values are empty

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.auth.login(this.credentials);
  }
}