import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Needed for *ngIf, *ngFor

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,   // ✅ required for structural directives
    FormsModule,    // ✅ enables [(ngModel)]
    RouterModule    // ✅ enables routerLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  onLogin() {
    if (this.email && this.password) {
      console.log('✅ Login submitted:', { email: this.email, password: this.password });
      // Later, you can add API call here
    } else {
      console.warn('⚠️ Please enter email and password');
    }
  }
}
