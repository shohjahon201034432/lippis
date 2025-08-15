import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="product-detail-container" *ngIf="product">
    <button class="back-btn" (click)="goBack()">← Orqaga</button>

    <div class="product-detail">
        <div class="product-images">
            <div class="main-image-container">
                <img [src]="selectedImage" [alt]="product.name" class="main-image" />
            </div>

            <div class="thumbnail-container">
                <img *ngFor="let img of thumbnailImages" [src]="img" [alt]="product.name" class="thumbnail"
                    [class.active]="img === selectedImage" (mouseover)="changeImage(img)" />
            </div>
        </div>

        <div class="product-info">
            <h1>{{ product.name }}</h1>
            <p class="price">\${{ product.price }}</p>

            <div class="description">
                <p>Yuqori sifatli material bilan ishlab chiqarilgan kepka.
                    Har qanday ob-havo sharoitida qulay va chiroyli ko'rinish beradi.</p>
            </div>

            <div class="actions">
                <button class="buy-btn" [routerLink]="['/buy', product.name]">Sotib olish</button>
                <button class="add-to-cart-btn">Savatga qo'shish</button>
            </div>
        </div>
    </div>
</div>

<div *ngIf="!product" class="not-found">
    <h2>Mahsulot topilmadi</h2>
    <button (click)="goBack()">Bosh sahifaga qaytish</button>
</div>
`,
  styles: [`
.product-detail-container {
max-width: 1200px;
margin: 0 auto;
padding: 20px;
}

.back-btn {
background: #007bff;
color: white;
border: none;
padding: 10px 20px;
border-radius: 5px;
cursor: pointer;
margin-bottom: 20px;
font-size: 16px;
}

.back-btn:hover {
background: #0056b3;
}

.product-detail {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 40px;
align-items: start;
}

.product-images {
display: flex;
flex-direction: column;
}

.main-image-container {
margin-bottom: 20px;
}

.main-image {
width: 100%;
height: 400px;
object-fit: cover;
border-radius: 8px;
box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.thumbnail-container {
display: flex;
gap: 10px;
justify-content: center;
}

.thumbnail {
width: 80px;
height: 80px;
object-fit: cover;
border-radius: 5px;
cursor: pointer;
border: 2px solid transparent;
transition: all 0.3s ease;
}

.thumbnail:hover,
.thumbnail.active {
border-color: #007bff;
transform: scale(1.1);
}

.product-info {
padding: 20px;
}

.product-info h1 {
font-size: 2.5em;
margin-bottom: 10px;
color: #333;
}

.price {
font-size: 2em;
font-weight: bold;
color: #007bff;
margin-bottom: 20px;
}

.description {
margin-bottom: 30px;
line-height: 1.6;
color: #666;
}

.actions {
display: flex;
gap: 15px;
}

.buy-btn, .add-to-cart-btn {
padding: 15px 30px;
border: none;
border-radius: 5px;
font-size: 16px;
cursor: pointer;
transition: all 0.3s ease;
}

.buy-btn {
background: #28a745;
color: white;
}

.buy-btn:hover {
background: #218838;
transform: translateY(-2px);
}

.add-to-cart-btn {
background: #007bff;
color: white;
}

.add-to-cart-btn:hover {
background: #0056b3;
transform: translateY(-2px);
}

.not-found {
text-align: center;
padding: 50px;
}

.not-found button {
background: #007bff;
color: white;
border: none;
padding: 10px 20px;
border-radius: 5px;
cursor: pointer;
}

@media (max-width: 768px) {
.product-detail {
grid-template-columns: 1fr;
gap: 20px;
}

.actions {
flex-direction: column;
}
}
`]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);

  product: Product | null = null;
  selectedImage: string = '';
  thumbnailImages: string[] = [];
  category: string = '';

  ngOnInit() {
    const productName = this.route.snapshot.paramMap.get('name');
    this.category = this.route.snapshot.paramMap.get('category') || '';

    if (!productName || !this.category) {
      this.router.navigate(['/']);
      return;
    }

    let products: Product[];

    if (this.category === 'classic') {
      products = this.productsService.classic();
    } else if (this.category === 'snapback') {
      products = this.productsService.snapback();
    } else if (this.category === 'truck') {
      products = this.productsService.truck();
    } else {
      this.router.navigate(['/']);
      return;
    }

    this.product = products.find((p: Product) => p.name === productName) || null;

    if (this.product) {
      this.selectedImage = this.product.img;
      this.thumbnailImages = [
        this.product.img,
        products[Math.min(1, products.length - 1)]?.img || this.product.img,
        products[Math.min(2, products.length - 1)]?.img || this.product.img
      ];
    } else {
      this.router.navigate(['/']);
    }
  }

  changeImage(image: string) {
    this.selectedImage = image;
  }

  navigateToBuy() {
    if (this.product) {
      this.router.navigate(['/buy', this.product.name]);
    }
  }

  goBack() {
    if (this.category) {
      this.router.navigate([`/${this.category}`]);
    } else {
      this.router.navigate(['/']);
    }
  }
}