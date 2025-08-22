import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../products.service';

interface CreditCard {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderName: string;
}

interface PurchaseInfo {
  productName: string;
  quantity: number;
  totalPrice: number;
}

@Component({
  selector: 'app-buy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div (window:scroll)="onWindowScroll()" class="content">
  <div *ngIf="product" class="buy-container">
      <button class="back-btn" (click)="goBack()">← Orqaga</button>
      
      <div class="product-card">
        <div class="product-image-section">
          <img [src]="product.img" [alt]="product.name" />
        </div>

        <div class="product-info-section">
          <h1>{{ product.name }}</h1>
          <p class="price">{{ product.price | currency:'USD' }}</p>
          <p class="desc">Yuqori sifatli material bilan ishlab chiqarilgan kepka. Har qanday ob-havo sharoitida qulay va chiroyli ko'rinish beradi.</p>
          
          <!-- Quantity Section -->
          <div class="quantity-section">
            <h3>Miqdor</h3>
            <div class="quantity-controls">
              <button class="qty-btn" (click)="decreaseQuantity()" [disabled]="quantity <= 1">−</button>
              <span class="quantity">{{ quantity }}</span>
              <button class="qty-btn" (click)="increaseQuantity()">+</button>
            </div>
          </div>

          <!-- Total Price -->
          <div class="total-section">
            <div class="total-row">
              <span>Narxi:</span>
              <span>{{ product.price | currency:'USD' }}</span>
            </div>
            <div class="total-row">
              <span>Miqdor:</span>
              <span>{{ quantity }}</span>
            </div>
            <div class="total-row total-final">
              <span>Jami:</span>
              <span>{{ getTotalPrice() | currency:'USD' }}</span>
            </div>
          </div>

          <!-- Payment Form -->
          <div class="payment-section" *ngIf="showPaymentForm">
            <h3>💳 To'lov ma'lumotlari</h3>
            <form class="payment-form" (ngSubmit)="processPurchase()" #paymentForm="ngForm">
              <div class="form-group">
                <label for="cardNumber">Karta raqami</label>
                <input
                  type="text"
                  id="cardNumber"
                  [(ngModel)]="creditCard.number"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  (input)="formatCardNumber($event)"
                  required
                />
              </div>

              <div class="form-group">
                <label for="cardHolder">Karta egasining ismi</label>
                <input
                  type="text"
                  id="cardHolder"
                  [(ngModel)]="creditCard.holderName"
                  name="cardHolder"
                  placeholder="JOHN DOE"
                  required
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="expiryMonth">Oy</label>
                  <select id="expiryMonth" [(ngModel)]="creditCard.expiryMonth" name="expiryMonth" required>
                    <option value="">Oy</option>
                    <option *ngFor="let month of months" [value]="month.value">{{ month.label }}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="expiryYear">Yil</label>
                  <select id="expiryYear" [(ngModel)]="creditCard.expiryYear" name="expiryYear" required>
                    <option value="">Yil</option>
                    <option *ngFor="let year of years" [value]="year">{{ year }}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    [(ngModel)]="creditCard.cvv"
                    name="cvv"
                    placeholder="123"
                    maxlength="4"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                class="pay-btn"
                [disabled]="!paymentForm.form.valid || isProcessing"
              >
                <span *ngIf="!isProcessing">💸 To'lash - {{ getTotalPrice() | currency:'USD' }}</span>
                <span *ngIf="isProcessing">⏳ Jarayon...</span>
              </button>
            </form>
          </div>

          <button 
            class="confirm-btn" 
            *ngIf="!showPaymentForm"
            (click)="showPaymentForm = true"
          >
            🛒 Buyurtma berish
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div *ngIf="showSuccessModal" class="modal-overlay" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="success-icon">✓</div>
        <h2>🎉 Xarid muvaffaqiyatli amalga oshirildi!</h2>
        <p><strong>📦 Mahsulot:</strong> {{ lastPurchase?.productName }}</p>
        <p><strong>🔢 Miqdor:</strong> {{ lastPurchase?.quantity }}</p>
        <p><strong>💰 Jami:</strong> {{ lastPurchase?.totalPrice | currency:'USD' }}</p>
        <button class="modal-btn" (click)="goToHomePage()">🏠 Bosh sahifa</button>
        <button class="modal-btn secondary" (click)="closeModal()">❌ Yopish</button>
      </div>
    </div>
</div>

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
  .scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-to-top:hover {
  background-color: #0056b3;
}

    .buy-container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 30px;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 71, 157, 0.1);
    }

    .back-btn {
      background: linear-gradient(135deg, #00479d 0%, #003266 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 30px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 71, 157, 0.25);
    }

    .back-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 71, 157, 0.35);
    }

    .product-card {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 40px;
      align-items: start;
      background: white;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.04);
    }

    .product-image-section {
      position: sticky;
      top: 20px;
    }

    .product-card img {
      width: 100%;
      height: 400px;
      border-radius: 16px;
      object-fit: cover;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      transition: transform 0.3s ease;
    }

    .product-card img:hover {
      transform: scale(1.02);
    }

    .product-info-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .product-card h1 {
      font-size: 28px;
      color: #00479d;
      margin: 0;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .price {
      color: #f7941d;
      font-size: 32px;
      font-weight: 800;
      margin: 0;
      text-shadow: 0 2px 4px rgba(247, 148, 29, 0.2);
    }

    .desc {
      font-size: 16px;
      color: #6c757d;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
      border-left: 4px solid #00479d;
    }

    .quantity-section {
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
      padding: 24px;
      border-radius: 16px;
      border: 1px solid rgba(0, 71, 157, 0.1);
    }

    .quantity-section h3 {
      color: #00479d;
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }

    .qty-btn {
      width: 50px;
      height: 50px;
      border: 2px solid #00479d;
      background: white;
      color: #00479d;
      border-radius: 50%;
      font-size: 22px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 71, 157, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qty-btn:hover:not(:disabled) {
      background: #00479d;
      color: white;
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 71, 157, 0.3);
    }

    .qty-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
    }

    .quantity {
      font-size: 24px;
      font-weight: 700;
      color: #00479d;
      min-width: 40px;
      text-align: center;
      background: white;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: inset 0 2px 4px rgba(0, 71, 157, 0.1);
    }

    .total-section {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 24px;
      border-radius: 16px;
      border: 1px solid #dee2e6;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    .total-final {
      border-top: 3px solid #00479d;
      padding-top: 16px;
      margin-top: 16px;
      font-weight: 700;
      font-size: 20px;
      color: #00479d;
      background: white;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 71, 157, 0.1);
    }

    .payment-section {
      background: linear-gradient(135deg, #fff5f5 0%, #f0f9ff 100%);
      padding: 28px;
      border-radius: 16px;
      border: 1px solid rgba(0, 71, 157, 0.15);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
      text-align: left;
    }

    .payment-section h3 {
      color: #00479d;
      margin: 0 0 24px 0;
      font-size: 22px;
      font-weight: 600;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .payment-section h3::before,
    .payment-section h3::after {
      content: '';
      height: 2px;
      background: linear-gradient(90deg, transparent, #00479d, transparent);
      flex: 1;
    }

    .payment-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .form-group label {
      margin-bottom: 8px;
      font-weight: 600;
      color: #374151;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-group input,
    .form-group select {
      padding: 14px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #00479d;
      box-shadow: 0 0 0 4px rgba(0, 71, 157, 0.1);
      transform: translateY(-1px);
    }

    .form-group input:valid {
      border-color: #10b981;
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr;
      gap: 16px;
    }

    .pay-btn {
      padding: 16px 32px;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      margin-top: 20px;
      box-shadow: 0 6px 20px rgba(40, 167, 69, 0.25);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .pay-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(40, 167, 69, 0.35);
    }

    .pay-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      background: #9ca3af;
    }

    .confirm-btn {
      padding: 16px 40px;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 6px 20px rgba(40, 167, 69, 0.25);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 10px;
    }

    .confirm-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(40, 167, 69, 0.35);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: white;
      padding: 40px;
      border-radius: 20px;
      text-align: center;
      max-width: 450px;
      width: 90%;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(30px) scale(0.9);
      }
      to { 
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .success-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      margin: 0 auto 24px;
      box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .modal-content h2 {
      color: #1f2937;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 700;
    }

    .modal-content p {
      color: #6b7280;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    .modal-btn {
      background: linear-gradient(135deg, #00479d 0%, #003266 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      cursor: pointer;
      margin: 8px 6px;
      font-size: 15px;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 71, 157, 0.25);
    }

    .modal-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 71, 157, 0.35);
    }

    .modal-btn.secondary {
      background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
      box-shadow: 0 4px 12px rgba(108, 117, 125, 0.25);
    }

    .modal-btn.secondary:hover {
      box-shadow: 0 8px 25px rgba(108, 117, 125, 0.35);
    }

    @media (max-width: 768px) {
      .buy-container {
        margin: 20px;
        padding: 20px;
      }

      .product-card {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .product-image-section {
        position: static;
        order: -1;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .quantity-controls {
        gap: 20px;
      }

      .back-btn {
        width: 100%;
        text-align: center;
      }

      .qty-btn {
        width: 45px;
        height: 45px;
        font-size: 20px;
      }

      .quantity {
        font-size: 22px;
        padding: 10px 16px;
      }
    }

    @media (max-width: 480px) {
      .modal-content {
        padding: 25px 20px;
      }

      .modal-btn {
        display: block;
        width: 100%;
        margin: 8px 0;
      }

      .success-icon {
        width: 70px;
        height: 70px;
        font-size: 32px;
      }
    }
  `]
})
export class BuyComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductsService);

  product: Product | null = null;
  quantity: number = 1;
  showPaymentForm: boolean = false;
  isProcessing: boolean = false;
  showSuccessModal: boolean = false;

  lastPurchase: PurchaseInfo | null = null;

  creditCard: CreditCard = {
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: ''
  };

  scroll = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scroll = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 100;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  months = [
    { value: '01', label: '01 - Yanvar' },
    { value: '02', label: '02 - Fevral' },
    { value: '03', label: '03 - Mart' },
    { value: '04', label: '04 - Aprel' },
    { value: '05', label: '05 - May' },
    { value: '06', label: '06 - Iyun' },
    { value: '07', label: '07 - Iyul' },
    { value: '08', label: '08 - Avgust' },
    { value: '09', label: '09 - Sentyabr' },
    { value: '10', label: '10 - Oktyabr' },
    { value: '11', label: '11 - Noyabr' },
    { value: '12', label: '12 - Dekabr' }
  ];

  years: number[] = [];

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 100; i <= currentYear + 100; i++) {
      this.years.push(i);
    }
    console.log('Years generated:', this.years);

    // Get product name from route parameters
    const name = this.route.snapshot.paramMap.get('name');
    console.log('Route param name:', name);

    if (name) {
      const decodedName = decodeURIComponent(name);
      console.log('Decoded name:', decodedName);
      this.product = this.productService.getProductByName(decodedName);

      if (!this.product) {
        console.error('Product not found:', decodedName);
        this.router.navigate(['/']);
      } else {
        console.log('Fetched product:', this.product);
      }
    } else {
      console.error('No product name provided in route');
      this.router.navigate(['/']);
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalPrice(): number {
    return this.product ? this.product.price * this.quantity : 0;
  }

  formatCardNumber(event: Event): void {
    const target = event.target as HTMLInputElement;
    let value = target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    value = value.substring(0, 16);
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.creditCard.number = formattedValue;
    target.value = formattedValue;
  }

  processPurchase(): void {
    if (!this.product) return;

    this.isProcessing = true;

    this.lastPurchase = {
      productName: this.product.name,
      quantity: this.quantity,
      totalPrice: this.getTotalPrice()
    };

    setTimeout(() => {
      this.isProcessing = false;
      this.showSuccessModal = true;
      this.showPaymentForm = false;
      this.resetForm();
    }, 2000);
  }

  private resetForm(): void {
    this.quantity = 1;
    this.creditCard = {
      number: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      holderName: ''
    };
  }

  closeModal(): void {
    this.showSuccessModal = false;
  }

  goToHomePage(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}