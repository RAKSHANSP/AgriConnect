import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  location: string;
  phone: string;
  imageUrl?: string;
  postedBy: { name: string };
  postedDate: Date;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class ProductComponent {
  products: Product[] = [];
  searchTerm: string = '';
  currentProduct: any = null; // Start as null to hide form
  isEditing = false;
  token = localStorage.getItem('token') || '';
  selectedImage: File | null = null;
  showForm = false; // Flag to control form visibility

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  loadProducts() {
    const url = this.searchTerm ? `http://localhost:5000/products?search=${this.searchTerm}` : 'http://localhost:5000/products';
    this.http.get<Product[]>(url)
      .subscribe({
        next: (data) => this.products = data,
        error: (err) => console.error('Error loading products:', err)
      });
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  showAddForm() {
    this.currentProduct = { name: '', description: '', quantity: 0, price: 0, location: '', phone: '' };
    this.selectedImage = null;
    this.isEditing = false;
    this.showForm = true; // Show the form
    this.searchTerm = ''; // Clear search to show all on save
    this.loadProducts(); // Refresh to show all
  }

  hideForm() {
    this.showForm = false;
    this.currentProduct = null;
  }

  editProduct(product: Product) {
    this.currentProduct = { ...product };
    this.selectedImage = null;
    this.isEditing = true;
    this.showForm = true;
  }

  saveProduct() {
    if (!this.currentProduct.name.trim()) {
      alert('Name is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.currentProduct.name);
    formData.append('description', this.currentProduct.description);
    formData.append('quantity', this.currentProduct.quantity.toString());
    formData.append('price', this.currentProduct.price.toString());
    formData.append('location', this.currentProduct.location);
    formData.append('phone', this.currentProduct.phone);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    const url = this.isEditing ? `http://localhost:5000/products/${this.currentProduct._id}` : 'http://localhost:5000/products';
    const method = this.isEditing ? 'PUT' : 'POST';

    this.http.request(method, url, {
      body: formData,
      headers: { Authorization: `Bearer ${this.token}` },
      reportProgress: true
    }).subscribe({
      next: (res: any) => {
        this.loadProducts(); // Refresh list
        this.hideForm(); // Hide form
        alert('Product saved successfully!');
      },
      error: (err) => alert('Error saving product: ' + (err.error?.message || 'Unknown error'))
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`http://localhost:5000/products/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).subscribe({
        next: () => {
          this.loadProducts();
          alert('Product deleted!');
        },
        error: (err) => alert('Error deleting product: ' + (err.error?.message || 'Unknown error'))
      });
    }
  }

  buyProduct(product: Product) {
    if (confirm(`Confirm purchase of ${product.name} for ₹${product.price}?`)) {
      alert('Order recorded! Call the seller...');
      window.open(`tel:${product.phone}`); // Opens phone dialer
    }
  }

  isOwner(product: Product): boolean {
    // Placeholder - compare with decoded token
    return true; // For demo
  }

  updateQuantity(productId: string, newQuantity: number) {
    this.http.put(`http://localhost:5000/products/${productId}`, { quantity: newQuantity }, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => this.loadProducts(),
      error: (err) => alert('Error updating quantity')
    });
  }

  updateQuantityInline(event: Event, productId: string) {
    const target = event.target as HTMLElement;
    if (target && target.innerText) {
      const newQuantity = parseInt(target.innerText.trim(), 10);
      if (!isNaN(newQuantity) && newQuantity >= 0) {
        this.updateQuantity(productId, newQuantity);
      } else {
        alert('Invalid quantity');
        this.loadProducts(); // Revert to original
      }
    }
  }
}