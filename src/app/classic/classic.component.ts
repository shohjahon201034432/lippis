import { Component, inject } from '@angular/core';
import { ProductsService } from '../products.service';
import { NgFor } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-classic',
  standalone: true,
  imports: [NgFor, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './classic.component.html',
  styleUrl: './classic.component.css'
})
export class ClassicComponent {
  productservice = inject(ProductsService);
  allProducts = this.productservice.classic();
  maxPrice: number = 9999;
  minPrice: number = 0;

  get filteredProducts() {
    if (!this.maxPrice || this.maxPrice <= 0 || this.maxPrice > 9999 || this.minPrice < 0) {
      return this.allProducts;
    }
    return this.allProducts.filter(item => item.price >= this.minPrice && item.price <= this.maxPrice);
  }
}
