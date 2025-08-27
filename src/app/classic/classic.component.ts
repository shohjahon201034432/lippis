import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../products.service';

interface Review {
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-classic',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './classic.component.html',
  styleUrls: ['./classic.component.css']
})
export class ClassicComponent {
  scroll = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scroll = window.scrollY > 100;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  productService = inject(ProductsService);
  router = inject(Router);

  allProducts: Product[] = this.productService.classic();
  filteredProducts: Product[] = this.allProducts;

  maxPrice: number = 9999;
  minPrice: number = 0;

  newReviewComment: { [productName: string]: string } = {};
  newReviewRating: { [productName: string]: number } = {};

  // Sharhlar localStorage dan olib kelinadi
  reviewsData: { [productName: string]: Review[] } = {};

  constructor() {
    this.loadAllReviews();
  }

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
    this.router.navigate(['/product', 'classic', productName]);
  }

  buyProduct(event: Event, product: Product) {
    event.stopPropagation();
    this.router.navigate(['/buy', product.name]);
  }

  // Sharhlarni localStorage'dan yuklash
  loadAllReviews() {
    const storedReviews = localStorage.getItem('classicProductReviews');
    if (storedReviews) {
      this.reviewsData = JSON.parse(storedReviews);
    }
  }

  // Berilgan mahsulot nomiga sharhlarni olish
  getReviews(productName: string): Review[] {
    return this.reviewsData[productName] || [];
  }

  // Yulduzcha reytingini o'rnatish
  setRating(productName: string, rating: number) {
    this.newReviewRating[productName] = rating;
  }

  // Sharh qo'shish
  addReview(productName: string) {
    const comment = this.newReviewComment[productName]?.trim();
    const rating = this.newReviewRating[productName];

    if (!comment) {
      alert('Iltimos, sharh yozing.');
      return;
    }
    if (!rating || rating < 1) {
      alert('Iltimos, yulduzcha tanlang.');
      return;
    }

    const productReviews = this.reviewsData[productName] || [];
    productReviews.push({ comment, rating });
    this.reviewsData[productName] = productReviews;

    localStorage.setItem('classicProductReviews', JSON.stringify(this.reviewsData));

    // Tozalash
    this.newReviewComment[productName] = '';
    this.newReviewRating[productName] = 0;
  }
}
