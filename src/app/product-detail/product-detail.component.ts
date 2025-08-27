import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../products.service';
import { FavouritesService } from '../favourites.service';
import { Subscription } from 'rxjs';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="product-detail-container" *ngIf="product; else notFound">
      <button class="back-btn" (click)="goBack()">← Orqaga</button>

      <div class="product-detail">
        <div class="product-images">
          <div class="main-image-container">
            <img 
              [src]="selectedImage" 
              [alt]="product.name" 
              class="main-image"
              (click)="openImageModal(selectedImage)" 
            />
            <button 
              class="favourite-btn"
              (click)="toggleFavourite()"
              [class.active]="isFavourite"
              [title]="isFavourite ? 'Favouritesdan ochirish' : 'Favouritesga qoshish'"
              [disabled]="!product"
            >
              {{ isFavourite ? '❤️' : '🤍' }}
            </button>
          </div>

          <div class="thumbnail-container">
            <img
              *ngFor="let img of product.images"
              [src]="img"
              [alt]="product.name"
              class="thumbnail"
              [class.active]="img === selectedImage"
              (mouseover)="changeImage(img)"
              (click)="openImageModal(img)"
            />
          </div>
        </div>

        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <p class="price">{{ product.price | currency:'USD' }}</p>

          <div class="description">
            <p>
              Yuqori sifatli material bilan ishlab chiqarilgan kepka. Har qanday
              ob-havo sharoitida qulay va chiroyli ko'rinish beradi.
            </p>
          </div>

          <div class="actions">
            <button class="buy-btn" [routerLink]="['/buy', product.name]">
              🛒 Sotib olish
            </button>
            <button 
              class="favourite-action-btn" 
              (click)="toggleFavourite()"
              [class.active]="isFavourite"
              [disabled]="!product"
            >
              {{ isFavourite ? 'Favouritesdan ochirish' : 'Favouritesga qoshish' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Sharxlar bo'limi -->
      <div class="reviews-section">
        <div class="reviews-header">
          <h2>Mijozlar sharhlari ({{ reviews.length }})</h2>
          <button class="add-review-btn" (click)="toggleReviewForm()">
            {{ showReviewForm ? 'Yopish' : 'Sharh qoshish' }}
          </button>
        </div>

        <!-- Sharh qo'shish formasi -->
        <div class="review-form" *ngIf="showReviewForm">
          <div class="form-group">
            <label>Ismingiz:</label>
            <input 
              type="text" 
              [(ngModel)]="newReview.name" 
              placeholder="Ismingizni kiriting"
              maxlength="50"
            >
          </div>
          
          <div class="form-group">
            <label>Baho:</label>
            <div class="star-rating">
              <span 
                *ngFor="let star of [1,2,3,4,5]"
                class="star"
                [class.active]="star <= newReview.rating"
                (click)="setRating(star)"
                (mouseover)="hoverRating = star"
                (mouseleave)="hoverRating = 0"
              >
                ★
              </span>
            </div>
          </div>

          <div class="form-group">
            <label>Sharhingiz:</label>
            <textarea 
              [(ngModel)]="newReview.comment" 
              placeholder="Bu mahsulot haqidagi fikringizni yozing..."
              maxlength="500"
              rows="4"
            ></textarea>
            <small>{{ newReview.comment.length }}/500</small>
          </div>

          <div class="form-buttons">
            <button class="submit-btn" (click)="submitReview()">Yuborish</button>
            <button class="cancel-btn" (click)="cancelReview()">Bekor qilish</button>
          </div>
        </div>

        <!-- Sharxlar ro'yxati -->
        <div class="reviews-list" *ngIf="reviews.length > 0; else noReviews">
          <div class="review" *ngFor="let review of reviews">
            <div class="review-header">
              <span class="reviewer-name">{{ review.name }}</span>
              <div class="review-stars">
                <span *ngFor="let star of [1,2,3,4,5]" 
                      [class]="star <= review.rating ? 'star filled' : 'star empty'">★</span>
              </div>
              <span class="review-date">{{ review.date }}</span>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        </div>

        <ng-template #noReviews>
          <div class="no-reviews">
            <p>Hali hech qanday sharh yo'q. Birinchi bo'lib sharh qoldiring!</p>
          </div>
        </ng-template>
      </div>
    </div>

    <!-- Rasm modali -->
    <div class="image-modal" *ngIf="showImageModal" (click)="closeImageModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeImageModal()">×</button>
        <img [src]="modalImage" [alt]="product?.name" class="modal-image">
        
        <div class="modal-thumbnails">
          <img
            *ngFor="let img of product?.images"
            [src]="img"
            [alt]="product?.name"
            class="modal-thumbnail"
            [class.active]="img === modalImage"
            (click)="selectModalImage(img)"
          />
        </div>
        
        <button class="prev-btn" (click)="previousImage()">‹</button>
        <button class="next-btn" (click)="nextImage()">›</button>
      </div>
    </div>

    <ng-template #notFound>
      <div class="not-found">
        <div class="not-found-content">
          <div class="not-found-icon">😔</div>
          <h2>Mahsulot topilmadi</h2>
          <p>Kechirasiz, siz qidirgan mahsulot mavjud emas.</p>
          <button class="home-btn" (click)="goBack()">🏠 Bosh sahifaga qaytish</button>
        </div>
      </div>
    </ng-template>

    <!-- Scroll to top tugmasi -->
    <button
      class="scroll-to-top"
      *ngIf="scroll"
      (click)="scrollToTop()"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  `,
  styles: [`
  /* Updated compact styles */
.scroll-to-top {
  position: fixed;
  bottom: 15px;
  right: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-to-top:hover {
  background-color: #0056b3;
}

.product-detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 15px;
  min-height: 80vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.back-btn {
  background: linear-gradient(135deg, #00479d 0%, #003266 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 8px rgba(0, 71, 157, 0.25);
}

.back-btn:hover {
  background: linear-gradient(135deg, #003266 0%, #002147 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(0, 71, 157, 0.35);
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: start;
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 71, 157, 0.1);
  margin-bottom: 20px;
}

.product-images {
  display: flex;
  flex-direction: column;
}

.main-image-container {
  position: relative;
  margin-bottom: 15px;
}

.main-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.main-image:hover {
  transform: scale(1.02);
}

.thumbnail-container {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.thumbnail {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail:hover,
.thumbnail.active {
  border-color: #00479d;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 71, 157, 0.3);
}

.favourite-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.favourite-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.favourite-btn.active {
  background: rgba(255, 182, 193, 0.9);
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 50%, 100% { transform: scale(1); }
  25%, 75% { transform: scale(1.05); }
}

.product-info {
  padding: 15px 0;
}

.product-info h1 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #00479d;
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 0 1px 3px rgba(0, 71, 157, 0.1);
}

.price {
  font-size: 24px;
  font-weight: 800;
  color: #f7941d;
  margin-bottom: 15px;
  text-shadow: 0 1px 3px rgba(247, 148, 29, 0.2);
}

.description {
  margin-bottom: 20px;
  line-height: 1.6;
  color: #6c757d;
  font-size: 14px;
  padding: 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
  border-left: 3px solid #00479d;
}

.actions {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.buy-btn,
.favourite-action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.buy-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.25);
}

.buy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.35);
}

.favourite-action-btn {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.25);
}

.favourite-action-btn.active {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.25);
}

.favourite-action-btn:hover {
  transform: translateY(-2px);
}

/* Reviews section - compact design */
.reviews-section {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 71, 157, 0.08);
  transition: all 0.3s ease;
}

.reviews-section:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
  position: relative;
}

.reviews-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, #00479d, #007bff);
  border-radius: 1px;
}

.reviews-header h2 {
  color: #1e293b;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reviews-header h2::before {
  content: '💬';
  font-size: 16px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  60% { transform: translateY(-3px); }
}

.add-review-btn {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 10px rgba(0, 123, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.add-review-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.add-review-btn:hover::before {
  left: 100%;
}

.add-review-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
}

.add-review-btn:active {
  transform: translateY(-1px) scale(1.02);
}

/* Review form - compact and modern */
.review-form {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #cbd5e1;
  animation: slideDown 0.3s ease-out;
  backdrop-filter: blur(8px);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #334155;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  transform: translateY(-1px);
}

.form-group small {
  color: #64748b;
  font-size: 10px;
  float: right;
  margin-top: 3px;
  font-weight: 500;
}

.star-rating {
  display: flex;
  gap: 2px;
  margin-bottom: 6px;
}

.star {
  font-size: 22px;
  color: #d1d5db;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
}

.star:hover {
  color: #fbbf24;
  transform: scale(1.15) rotate(10deg);
}

.star.active {
  color: #f59e0b;
  animation: starPulse 0.3s ease;
}

@keyframes starPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1.1); }
}

.form-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.submit-btn,
.cancel-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.submit-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 3px 8px rgba(16, 185, 129, 0.2);
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3);
}

.cancel-btn {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: white;
}

.cancel-btn:hover {
  transform: translateY(-1px);
  background: linear-gradient(135deg, #475569 0%, #334155 100%);
}

/* Reviews list - card style */
.reviews-list {
  display: grid;
  gap: 10px;
}

.review {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.review::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #007bff, #00479d);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.review:hover::before {
  transform: scaleY(1);
}

.review:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #cbd5e1;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.reviewer-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 14px;
  background: linear-gradient(135deg, #007bff, #00479d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.review-stars {
  display: flex;
  gap: 1px;
}

.review-stars .star {
  font-size: 12px;
  margin: 0;
  cursor: default;
  filter: none;
}

.review-stars .star.filled {
  color: #f59e0b;
}

.review-stars .star.empty {
  color: #d1d5db;
}

.review-date {
  color: #64748b;
  font-size: 10px;
  margin-left: auto;
  font-weight: 500;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 10px;
}

.review-comment {
  color: #475569;
  line-height: 1.5;
  font-size: 12px;
  position: relative;
  padding-left: 12px;
}

.review-comment::before {
  content: '"';
  position: absolute;
  left: 0;
  top: -4px;
  font-size: 20px;
  color: #cbd5e1;
  font-weight: bold;
}

.no-reviews {
  text-align: center;
  padding: 30px 15px;
  color: #64748b;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 10px;
  border: 2px dashed #cbd5e1;
}

.no-reviews p {
  font-size: 14px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.no-reviews p::before {
  content: '📝';
  font-size: 16px;
}

/* Responsive optimization */
@media (max-width: 768px) {
  .reviews-section {
    padding: 12px;
  }

  .reviews-header {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .reviews-header h2 {
    font-size: 16px;
    text-align: center;
  }

  .add-review-btn {
    align-self: center;
    padding: 8px 16px;
  }

  .review-form {
    padding: 12px;
  }

  .form-buttons {
    flex-direction: column;
  }

  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .review-date {
    margin-left: 0;
    align-self: flex-end;
  }

  .star {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .reviews-section {
    padding: 10px;
  }

  .review {
    padding: 10px;
  }

  .reviewer-name {
    font-size: 12px;
  }

  .review-comment {
    font-size: 11px;
  }

  .star {
    font-size: 18px;
  }

  .reviews-header h2 {
    font-size: 14px;
  }
}

/* Additional animation effects */
.review {
  animation: fadeInUp 0.5s ease-out;
}

.review:nth-child(even) {
  animation-delay: 0.1s;
}

.review:nth-child(odd) {
  animation-delay: 0.2s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Text selection style */
.review-comment::selection {
  background: rgba(0, 123, 255, 0.2);
}

/* Scroll behavior */
.reviews-list {
  scroll-behavior: smooth;
}

/* Loading animation */
.reviews-section.loading {
  position: relative;
}

.reviews-section.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #007bff, #00479d, #007bff);
  background-size: 200% 100%;
  animation: loading 2s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private favouritesService = inject(FavouritesService);

  product: Product | null = null;
  selectedImage: string = '';
  category: string = '';
  isFavourite: boolean = false;
  scroll = false;

  // Image modal
  showImageModal = false;
  modalImage = '';
  currentImageIndex = 0;

  // Reviews
  reviews: Review[] = [
    {
      id: 1,
      name: 'Aziz Karimov',
      rating: 5,
      comment: 'Juda sifatli kepka! Material yumshoq va bardoshli. Har kuni kiyaman, hech qanday muammo yo\'q.',
      date: '15 mart, 2024'
    },
    {
      id: 2,
      name: 'Malika Tosheva',
      rating: 4,
      comment: 'Chiroyli dizayn va qulay. Faqat biroz katta keldi, lekin umuman yaxshi mahsulot.',
      date: '8 mart, 2024'
    },
    {
      id: 3,
      name: 'Bobur Alimov',
      rating: 5,
      comment: 'Narxi ham qulay, sifati ham yaxshi. Sport qilganda ham qulay. Tavsiya qilaman!',
      date: '28 fevral, 2024'
    }
  ];

  showReviewForm = false;
  hoverRating = 0;
  newReview = {
    name: '',
    rating: 0,
    comment: ''
  };

  private subscription: Subscription = new Subscription();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scroll = window.scrollY > 100;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(): void {
    const productName = decodeURIComponent(this.route.snapshot.paramMap.get('name') || '');
    const category = this.route.snapshot.paramMap.get('category') || '';
    console.log('Route params:', { category, productName });

    if (!productName || !category) {
      console.error('Missing product name or category');
      this.router.navigate(['/']);
      return;
    }

    this.category = category;
    const allProducts = [
      ...this.productsService.classic(),
      ...this.productsService.snapback(),
      ...this.productsService.truck()
    ];
    this.product = allProducts.find(p => p.name === productName) || null;
    console.log('Fetched product:', this.product);

    if (this.product && this.product.images && this.product.images.length > 0) {
      this.selectedImage = this.product.images[0];
      this.checkFavouriteStatus();
      this.subscription.add(
        this.favouritesService.favourites$.subscribe(() => {
          this.checkFavouriteStatus();
        })
      );
    } else {
      console.error('Product not found or invalid images');
      this.product = null;
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeImage(image: string): void {
    this.selectedImage = image;
  }

  toggleFavourite(): void {
    if (this.product) {
      this.favouritesService.toggleFavourite(this.product);
      this.checkFavouriteStatus();
    }
  }

  private checkFavouriteStatus(): void {
    if (this.product) {
      this.isFavourite = this.favouritesService.isFavourite(this.product);
    } else {
      this.isFavourite = false;
    }
  }

  goBack(): void {
    this.router.navigate([`/${this.category}`]);
  }

  // Image modal methods
  openImageModal(image: string): void {
    this.showImageModal = true;
    this.modalImage = image;
    if (this.product?.images) {
      this.currentImageIndex = this.product.images.indexOf(image);
    }
    document.body.style.overflow = 'hidden';
  }

  closeImageModal(): void {
    this.showImageModal = false;
    document.body.style.overflow = 'auto';
  }

  selectModalImage(image: string): void {
    this.modalImage = image;
    if (this.product?.images) {
      this.currentImageIndex = this.product.images.indexOf(image);
    }
  }

  previousImage(): void {
    if (this.product?.images && this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.modalImage = this.product.images[this.currentImageIndex];
    }
  }

  nextImage(): void {
    if (this.product?.images && this.currentImageIndex < this.product.images.length - 1) {
      this.currentImageIndex++;
      this.modalImage = this.product.images[this.currentImageIndex];
    }
  }

  // Review methods
  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
    if (!this.showReviewForm) {
      this.resetReviewForm();
    }
  }

  setRating(rating: number): void {
    this.newReview.rating = rating;
  }

  submitReview(): void {
    if (!this.newReview.name.trim() || !this.newReview.comment.trim() || this.newReview.rating === 0) {
      alert('Iltimos, barcha maydonlarni to\'ldiring va baho bering!');
      return;
    }

    const review: Review = {
      id: this.reviews.length + 1,
      name: this.newReview.name.trim(),
      rating: this.newReview.rating,
      comment: this.newReview.comment.trim(),
      date: new Date().toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };

    this.reviews.unshift(review);
    this.resetReviewForm();
    this.showReviewForm = false;

    // Success message
    alert('Sharhingiz muvaffaqiyatli qo\'shildi!');
  }

  cancelReview(): void {
    this.resetReviewForm();
    this.showReviewForm = false;
  }

  private resetReviewForm(): void {
    this.newReview = {
      name: '',
      rating: 0,
      comment: ''
    };
    this.hoverRating = 0;
  }
}