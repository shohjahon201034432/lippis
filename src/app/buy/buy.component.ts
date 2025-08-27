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

.buy-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 71, 157, 0.1);
}

.back-btn {
  background: linear-gradient(135deg, #00479d 0%, #003266 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 8px rgba(0, 71, 157, 0.25);
}

.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(0, 71, 157, 0.35);
}

.product-card {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.product-image-section {
  position: sticky;
  top: 15px;
}

.product-card img {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;
}

.product-card img:hover {
  transform: scale(1.02);
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-card h1 {
  font-size: 24px;
  color: #00479d;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.price {
  color: #f7941d;
  font-size: 24px;
  font-weight: 800;
  margin: 0;
  text-shadow: 0 1px 3px rgba(247, 148, 29, 0.2);
}

.desc {
  font-size: 14px;
  color: #6c757d;
  line-height: 1.5;
  margin: 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #00479d;
}

.quantity-section {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(0, 71, 157, 0.1);
}

.quantity-section h3 {
  color: #00479d;
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #00479d;
  background: white;
  color: #00479d;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 8px rgba(0, 71, 157, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover:not(:disabled) {
  background: #00479d;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 71, 157, 0.3);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.quantity {
  font-size: 20px;
  font-weight: 700;
  color: #00479d;
  min-width: 30px;
  text-align: center;
  background: white;
  padding: 8px 15px;
  border-radius: 8px;
  box-shadow: inset 0 2px 3px rgba(0, 71, 157, 0.1);
}

.total-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #dee2e6;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.total-final {
  border-top: 2px solid #00479d;
  padding-top: 12px;
  margin-top: 12px;
  font-weight: 700;
  font-size: 16px;
  color: #00479d;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0, 71, 157, 0.1);
}

.payment-section {
  background: linear-gradient(135deg, #fff5f5 0%, #f0f9ff 100%);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(0, 71, 157, 0.15);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.06);
  text-align: left;
}

.payment-section h3 {
  color: #00479d;
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: 600;
  color: #374151;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #00479d;
  box-shadow: 0 0 0 3px rgba(0, 71, 157, 0.1);
  transform: translateY(-1px);
}

.form-group input:valid {
  border-color: #10b981;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 12px;
}

.pay-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 15px;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.25);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pay-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.35);
}

.pay-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: #9ca3af;
}

.confirm-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.25);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 8px;
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.35);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
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
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  max-width: 350px;
  width: 90%;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.success-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 15px;
  box-shadow: 0 6px 15px rgba(40, 167, 69, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.modal-content h2 {
  color: #1f2937;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 700;
}

.modal-content p {
  color: #6b7280;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.modal-btn {
  background: linear-gradient(135deg, #00479d 0%, #003266 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin: 6px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 8px rgba(0, 71, 157, 0.25);
}

.modal-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(0, 71, 157, 0.35);
}

.modal-btn.secondary {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  box-shadow: 0 3px 8px rgba(108, 117, 125, 0.25);
}

.modal-btn.secondary:hover {
  box-shadow: 0 6px 15px rgba(108, 117, 125, 0.35);
}

@media (max-width: 768px) {
  .buy-container {
    margin: 15px;
    padding: 15px;
  }

  .product-card {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .product-image-section {
    position: static;
    order: -1;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .quantity-controls {
    gap: 12px;
  }

  .back-btn {
    width: 100%;
    text-align: center;
  }

  .qty-btn {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }

  .quantity {
    font-size: 18px;
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 20px 15px;
  }

  .modal-btn {
    display: block;
    width: 100%;
    margin: 6px 0;
  }

  .success-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
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