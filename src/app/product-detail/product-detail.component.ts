import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService, Product } from '../products.service';
import { FavouritesService } from '../favourites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-detail-container" *ngIf="product; else notFound">
      <button class="back-btn" (click)="goBack()">← Orqaga</button>

      <div class="product-detail">
        <div class="product-images">
          <div class="main-image-container">
            <img [src]="selectedImage" [alt]="product.name" class="main-image" />
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
  `,
  styles: [
    `
      .product-detail-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 30px 20px;
        min-height: 100vh;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      }

      .back-btn {
        background: linear-gradient(135deg, #00479d 0%, #003266 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 12px;
        cursor: pointer;
        margin-bottom: 30px;
        font-size: 16px;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(0, 71, 157, 0.25);
      }

      .back-btn:hover {
        background: linear-gradient(135deg, #003266 0%, #002147 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 71, 157, 0.35);
      }

      .product-detail {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;
        align-items: start;
        background: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 71, 157, 0.1);
      }

      .product-images {
        display: flex;
        flex-direction: column;
      }

      .main-image-container {
        position: relative;
        margin-bottom: 20px;
      }

      .main-image {
        width: 100%;
        height: 450px;
        object-fit: cover;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease;
      }

      .main-image:hover {
        transform: scale(1.02);
      }

      .favourite-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .favourite-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
      }

      .favourite-btn.active {
        background: rgba(255, 182, 193, 0.9);
        animation: heartbeat 1.5s ease-in-out infinite;
      }

      .favourite-btn:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      @keyframes heartbeat {
        0%, 50%, 100% { transform: scale(1); }
        25%, 75% { transform: scale(1.05); }
      }

      .thumbnail-container {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .thumbnail {
        width: 90px;
        height: 90px;
        object-fit: cover;
        border-radius: 12px;
        cursor: pointer;
        border: 3px solid transparent;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .thumbnail:hover,
      .thumbnail.active {
        border-color: #00479d;
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(0, 71, 157, 0.3);
      }

      .product-info {
        padding: 20px 0;
      }

      .product-info h1 {
        font-size: 36px;
        margin-bottom: 15px;
        color: #00479d;
        font-weight: 700;
        line-height: 1.2;
        text-shadow: 0 2px 4px rgba(0, 71, 157, 0.1);
      }

      .price {
        font-size: 32px;
        font-weight: 800;
        color: #f7941d;
        margin-bottom: 25px;
        text-shadow: 0 2px 4px rgba(247, 148, 29, 0.2);
      }

      .description {
        margin-bottom: 35px;
        line-height: 1.7;
        color: #6c757d;
        font-size: 16px;
        padding: 25px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 16px;
        border-left: 4px solid #00479d;
      }

      .actions {
        display: flex;
        gap: 16px;
        flex-direction: column;
      }

      .buy-btn,
      .favourite-action-btn {
        padding: 16px 32px;
        border: none;
        border-radius: 12px;
        font-size: 16px;
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
        box-shadow: 0 6px 20px rgba(40, 167, 69, 0.25);
      }

      .buy-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 35px rgba(40, 167, 69, 0.35);
      }

      .favourite-action-btn {
        background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
        color: white;
        box-shadow: 0 6px 20px rgba(108, 117, 125, 0.25);
      }

      .favourite-action-btn.active {
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        box-shadow: 0 6px 20px rgba(220, 53, 69, 0.25);
      }

      .favourite-action-btn:hover {
        transform: translateY(-3px);
      }

      .favourite-action-btn:hover:not(.active) {
        box-shadow: 0 12px 35px rgba(108, 117, 125, 0.35);
      }

      .favourite-action-btn.active:hover {
        box-shadow: 0 12px 35px rgba(220, 53, 69, 0.35);
      }

      .favourite-action-btn:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .not-found {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 70vh;
        padding: 50px 20px;
      }

      .not-found-content {
        text-align: center;
        background: white;
        padding: 50px 40px;
        border-radius: 20px;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 71, 157, 0.1);
        max-width: 500px;
        width: 100%;
      }

      .not-found-icon {
        font-size: 80px;
        margin-bottom: 20px;
        opacity: 0.7;
      }

      .not-found-content h2 {
        color: #495057;
        font-size: 28px;
        margin-bottom: 15px;
        font-weight: 600;
      }

      .not-found-content p {
        color: #6c757d;
        font-size: 16px;
        margin-bottom: 30px;
        line-height: 1.6;
      }

      .home-btn {
        background: linear-gradient(135deg, #00479d 0%, #003266 100%);
        color: white;
        border: none;
        padding: 16px 32px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 6px 20px rgba(0, 71, 157, 0.25);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .home-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 35px rgba(0, 71, 157, 0.35);
      }

      @media (max-width: 768px) {
        .product-detail-container {
          padding: 20px 15px;
        }

        .product-detail {
          grid-template-columns: 1fr;
          gap: 30px;
          padding: 25px;
        }

        .main-image {
          height: 350px;
        }

        .product-info h1 {
          font-size: 28px;
        }

        .price {
          font-size: 28px;
        }

        .actions {
          gap: 12px;
        }

        .thumbnail-container {
          gap: 8px;
        }

        .thumbnail {
          width: 70px;
          height: 70px;
        }

        .favourite-btn {
          width: 45px;
          height: 45px;
          font-size: 20px;
        }
      }

      @media (max-width: 480px) {
        .product-detail {
          padding: 20px;
        }

        .not-found-content {
          padding: 35px 25px;
        }

        .not-found-icon {
          font-size: 60px;
        }

        .not-found-content h2 {
          font-size: 24px;
        }
      }
    `
  ]
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
  private subscription: Subscription = new Subscription();

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
    // Search all products instead of category-specific arrays
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
}