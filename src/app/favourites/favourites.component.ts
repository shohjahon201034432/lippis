import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd, NavigationError } from '@angular/router';
import { FavouritesService } from '../favourites.service';
import { Product } from '../products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="favourites-container">
      <div class="header">
        <button class="back-btn" (click)="goBack()">← Orqaga</button>
        <h1>🤍 Favourites</h1>
        <p class="count" *ngIf="favourites.length > 0">
          Jami: {{ favourites.length }} ta mahsulot
        </p>
      </div>

      <div *ngIf="favourites.length === 0" class="empty-state">
        <div class="empty-icon">💔</div>
        <h2>Mahsulotlar yo'q</h2>
        <p>Hali hech qanday mahsulot favourites ro'yxatiga qo'shilmagan.</p>
        <button class="shop-btn" (click)="goToHome()">🛍️ Xarid qilishga o'tish</button>
      </div>

      <div *ngIf="favourites.length > 0" class="favourites-grid">
        <div *ngFor="let product of favourites" class="product-card">
          <div class="product-image-container">
            <img [src]="product.img" [alt]="product.name" class="product-image" />
            <button 
              class="remove-btn"
              (click)="removeFromFavourites(product)"
              title="Sevimlilardan o'chirish"
            >
              ❌
            </button>
          </div>

          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">{{ product.price | currency:'USD' }}</p>
            
            <div class="product-actions">
              <button 
                class="buy-btn"
                [routerLink]="['/buy', product.name]"
              >
                🛒 Sotib olish
              </button>
              
              <button 
                class="view-btn"
                (click)="viewProductDetails(product)"
              >
                👁️ Ko'rish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="favourites.length > 0" class="clear-section">
        <button class="clear-all-btn" (click)="clearAllFavourites()">
          🗑️ Barchasini o'chirish
        </button>
      </div>
    </div>
  `,
  styles: [`
    .favourites-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
      position: relative;
    }

    .back-btn {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      background: linear-gradient(135deg, #00479d 0%, #003266 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 71, 157, 0.25);
    }

    .back-btn:hover {
      transform: translateY(-50%) translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 71, 157, 0.35);
    }

    .header h1 {
      font-size: 36px;
      color: #00479d;
      margin: 0 0 10px 0;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 71, 157, 0.1);
    }

    .count {
      font-size: 18px;
      color: #6c757d;
      margin: 0;
      font-weight: 500;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 71, 157, 0.1);
    }

    .empty-icon {
      font-size: 80px;
      margin-bottom: 20px;
      opacity: 0.7;
    }

    .empty-state h2 {
      color: #495057;
      font-size: 28px;
      margin-bottom: 15px;
      font-weight: 600;
    }

    .empty-state p {
      color: #6c757d;
      font-size: 16px;
      margin-bottom: 30px;
      line-height: 1.6;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .shop-btn {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      border: none;
      padding: 16px 32px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 6px 20px rgba(40, 167, 69, 0.25);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .shop-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(40, 167, 69, 0.35);
    }

    .favourites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }

    .product-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0, 71, 157, 0.1);
      position: relative;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
    }

    .product-image-container {
      position: relative;
      height: 250px;
      overflow: hidden;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .remove-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .remove-btn:hover {
      background: rgba(255, 82, 82, 0.9);
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(255, 82, 82, 0.3);
    }

    .product-info {
      padding: 25px;
    }

    .product-name {
      font-size: 20px;
      color: #00479d;
      margin: 0 0 10px 0;
      font-weight: 700;
      line-height: 1.3;
    }

    .product-price {
      font-size: 24px;
      color: #f7941d;
      margin: 0 0 20px 0;
      font-weight: 800;
      text-shadow: 0 1px 2px rgba(247, 148, 29, 0.2);
    }

    .product-actions {
      display: flex;
      gap: 12px;
    }

    .buy-btn,
    .view-btn {
      flex: 1;
      padding: 12px 20px;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      display: inline-block;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .buy-btn {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.25);
    }

    .buy-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(40, 167, 69, 0.35);
    }

    .view-btn {
      background: linear-gradient(135deg, #00479d 0%, #003266 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 71, 157, 0.25);
    }

    .view-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 71, 157, 0.35);
    }

    .clear-section {
      text-align: center;
      padding: 30px 0;
      border-top: 2px dashed #dee2e6;
    }

    .clear-all-btn {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: white;
      border: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.25);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .clear-all-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(220, 53, 69, 0.35);
    }

    @media (max-width: 768px) {
      .favourites-container {
        padding: 20px 15px;
      }

      .header h1 {
        font-size: 28px;
        margin-top: 50px;
      }

      .back-btn {
        position: static;
        transform: none;
        margin-bottom: 20px;
        width: 100%;
      }

      .back-btn:hover {
        transform: translateY(-2px);
      }

      .favourites-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .product-actions {
        flex-direction: column;
      }

      .buy-btn,
      .view-btn {
        flex: none;
      }
    }

    @media (max-width: 480px) {
      .empty-state {
        padding: 40px 15px;
      }

      .empty-icon {
        font-size: 60px;
      }

      .empty-state h2 {
        font-size: 24px;
      }
    }
  `]
})
export class FavouritesComponent implements OnInit, OnDestroy {
  private favouritesService = inject(FavouritesService);
  private router = inject(Router);
  favourites: Product[] = [];
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.favouritesService.favourites$.subscribe(favourites => {
        this.favourites = favourites;
        console.log('Favourites loaded:', favourites);
      })
    );
    this.subscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          console.log('Navigation successful:', event.url);
        } else if (event instanceof NavigationError) {
          console.error('Navigation failed:', event.error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeFromFavourites(product: Product): void {
    this.favouritesService.removeFromFavourites(product);
  }

  clearAllFavourites(): void {
    if (confirm("Barcha sevimli mahsulotlarni o'chirmoqchimisiz?")) {
      this.favouritesService.clearFavourites();
    }
  }

  viewProductDetails(product: Product): void {
    console.log('Viewing product:', product);
    try {
      if (!product.name || !product.category) {
        throw new Error('Invalid product data: name or category missing');
      }
      const encodedCategory = encodeURIComponent(product.category);
      const encodedName = encodeURIComponent(product.name);
      this.router.navigate(['/product', encodedCategory, encodedName]);
    } catch (error) {
      console.error('Navigation error:', error);
      this.router.navigate(['/']);
    }
  }


  goBack(): void {
    this.router.navigate(['/']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}