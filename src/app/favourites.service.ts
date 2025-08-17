// favourites.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './products.service';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  private favouritesSubject = new BehaviorSubject<Product[]>([]);
  public favourites$ = this.favouritesSubject.asObservable();

  private favourites: Product[] = [];

  constructor() {
    // LocalStorage dan ma'lumotlarni yuklash
    this.loadFromStorage();
  }

  // Favouritega qo'shish
  addToFavourites(product: Product): void {
    if (!this.isFavourite(product)) {
      this.favourites.push(product);
      this.updateStorage();
      this.favouritesSubject.next([...this.favourites]);
    }
  }

  // Favouritedan o'chirish
  removeFromFavourites(product: Product): void {
    this.favourites = this.favourites.filter(p => p.name !== product.name);
    this.updateStorage();
    this.favouritesSubject.next([...this.favourites]);
  }

  // Mahsulot favourite ekanligini tekshirish
  isFavourite(product: Product): boolean {
    return this.favourites.some(p => p.name === product.name);
  }

  // Barcha favouritelarni olish
  getFavourites(): Product[] {
    return [...this.favourites];
  }

  // Favouritelar sonini olish
  getFavouritesCount(): number {
    return this.favourites.length;
  }

  // Favouritelarni toggle qilish (qo'shish/o'chirish)
  toggleFavourite(product: Product): void {
    if (this.isFavourite(product)) {
      this.removeFromFavourites(product);
    } else {
      this.addToFavourites(product);
    }
  }

  // LocalStorage ga saqlash
  private updateStorage(): void {
    localStorage.setItem('favourites', JSON.stringify(this.favourites));
  }

  // LocalStorage dan yuklash
  private loadFromStorage(): void {
    const stored = localStorage.getItem('favourites');
    if (stored) {
      try {
        this.favourites = JSON.parse(stored);
        this.favouritesSubject.next([...this.favourites]);
      } catch (error) {
        console.error('Favourites ma\'lumotlarini yuklashda xatolik:', error);
        this.favourites = [];
      }
    }
  }

  // Barcha favouritelarni tozalash
  clearFavourites(): void {
    this.favourites = [];
    this.updateStorage();
    this.favouritesSubject.next([]);
  }
}