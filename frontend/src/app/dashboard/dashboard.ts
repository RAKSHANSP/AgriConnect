import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [], // Add necessary imports here (e.g., RouterLink if used directly)
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  constructor(private router: Router) {} // Inject Router

  goToWeather() {
    this.router.navigate(['/weather']); // Navigate to Weather Module
  }
  goToProducts() {
    this.router.navigate(['/products']);
  }
  goToDealerMarket() {
  this.router.navigate(['/dealer-market']);
  }
  goToInformationSharing() {
  this.router.navigate(['/information-sharing']);
}
}