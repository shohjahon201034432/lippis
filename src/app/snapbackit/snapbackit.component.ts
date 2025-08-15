import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-snapbackit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './snapbackit.component.html',
  styleUrls: ['./snapbackit.component.css']
})
export class SnapbackitComponent {
  productService = inject(ProductsService);
  router = inject(Router);

  allProducts: Product[] = this.productService.snapback();
  filteredProducts: Product[] = this.allProducts;
  maxPrice: number = 9999;
  minPrice: number = 0;

  onFilterChange() {
    this.filteredProducts = this.allProducts.filter(item => {
      const minPriceValid = this.minPrice === 0 || this.minPrice === null || item.price >= this.minPrice;
      const maxPriceValid = this.maxPrice === 9999 || this.maxPrice === null || item.price <= this.maxPrice;
      return minPriceValid && maxPriceValid;
    });
  }

  resetFilters() {
    this.minPrice = 0;
    this.maxPrice = 9999;
    this.filteredProducts = this.allProducts;
  }

  goToProductDetail(productName: string) {
    this.router.navigate(['/product', 'snapback', productName]);
  }

  buyProduct(event: Event, product: Product) {
    event.stopPropagation();
    this.router.navigate(['/buy', product.name]);
  }
}