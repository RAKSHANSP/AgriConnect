import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Dealer {
  _id: string;
  name: string;
  mobile: string;
  location: string;
  address: string;
  productsOffered: string[];
  rating: number;
  postedBy: { name: string };
  postedDate: Date;
}

interface Market {
  _id: string;
  name: string;
  location: string;
  type: string;
  timings: string;
  contact: string;
  commodities: string[];
  rating: number;
  postedDate: Date;
}

@Component({
  selector: 'app-dealer-market',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dealer-market.html',
  styleUrls: ['./dealer-market.css']
})
export class DealerMarketComponent {
  location: string = '';
  dealers: Dealer[] = [];
  markets: Market[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  searchLocation() {
    if (!this.location) {
      this.errorMessage = 'Please enter a location';
      return;
    }

    this.errorMessage = '';
    this.http.get<Dealer[]>(`http://localhost:5000/dealers?location=${this.location}`)
      .subscribe({
        next: (data) => this.dealers = data,
        error: (err) => this.errorMessage = 'Error fetching dealers'
      });

    this.http.get<Market[]>(`http://localhost:5000/markets?location=${this.location}`)
      .subscribe({
        next: (data) => this.markets = data,
        error: (err) => this.errorMessage = 'Error fetching markets'
      });
  }
}