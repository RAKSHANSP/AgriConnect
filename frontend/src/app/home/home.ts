import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // Import RouterLink for routerLink directive
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {}