import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Add CommonModule for common directives
import { RouterModule } from '@angular/router'; // Add RouterModule for routerLink

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add required imports
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
  goToGovtOfficial() {
    this.router.navigate(['/govt-official']);
  }
  goToIndividualChat() { 
    this.router.navigate(['/individual-chat']);
  }
  goToGroupChat() { 
    this.router.navigate(['/group-chat']);
  }
}