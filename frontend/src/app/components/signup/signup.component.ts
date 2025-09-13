import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule], // For ngModel, ngSubmit, routerLink
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'] // Use .scss
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  role: string = '';

  onSignup() {
    console.log('Signup submitted:', { name: this.name, email: this.email, password: this.password, role: this.role });
  }
}