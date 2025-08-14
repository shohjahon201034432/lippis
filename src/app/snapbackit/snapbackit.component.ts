import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProductsService } from '../products.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-snapbackit',
  imports: [NgFor, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './snapbackit.component.html',
  styleUrl: './snapbackit.component.css'
})
export class SnapbackitComponent {
  productservice = inject(ProductsService);
  allProducts = this.productservice.snapback();
  maxPrice: number = 9999;
  minPrice: number = 0;

  get filteredProducts() {
    if (!this.maxPrice || this.maxPrice <= 0 || this.maxPrice > 9999 || this.minPrice < 0) {
      return this.allProducts;
    }
    return this.allProducts.filter(item => item.price >= this.minPrice && item.price <= this.maxPrice);
  }
}
