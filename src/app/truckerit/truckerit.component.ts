import { Component, inject } from '@angular/core';
import { ProductsService } from '../products.service';
import { CurrencyPipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-truckerit',
  imports: [NgFor, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './truckerit.component.html',
  styleUrl: './truckerit.component.css'
})
export class TruckeritComponent {
  productservice = inject(ProductsService);
  allProducts = this.productservice.truck();
  maxPrice: number = 9999;
  minPrice: number = 0;

  get filteredProducts() {
    if (!this.maxPrice || this.maxPrice <= 0 || this.maxPrice > 9999 || this.minPrice < 0) {
      return this.allProducts;
    }
    return this.allProducts.filter(item => item.price >= this.minPrice && item.price <= this.maxPrice);
  }
}