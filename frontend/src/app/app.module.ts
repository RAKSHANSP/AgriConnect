import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { Home } from './home/home';
import {  Signup } from './signup/signup';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,   // ✅ Import HttpClientModule here
    Home,
    Signup,
    Login,
    Dashboard
  ],
  template: '<router-outlet></router-outlet>',
})
export class App {}
