import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-snapbackit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './truckerit.component.html',
  styleUrls: ['./truckerit.component.css']
})
export class TruckeritComponent {
  productService = inject(ProductsService);
  router = inject(Router);

  allProducts: Product[] = this.productService.truck();
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
    this.router.navigate(['/product', 'truck', productName]);
  }

  buyProduct(event: Event, product: Product) {
    event.stopPropagation();
    this.router.navigate(['/buy', product.name]);
  }

  // Property e'lon qilish
  scroll = false;

  // HostListener import qilish

  // Scroll hodisasini kuzatish
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scroll = window.scrollY > 100;
  }

  // Yuqoriga chiqish funksiyasi
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}