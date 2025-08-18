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
    this.loadFromStorage();
  }

  addToFavourites(product: Product): void {
    if (!this.isFavourite(product)) {
      this.favourites.push(product);
      this.updateStorage();
      this.favouritesSubject.next([...this.favourites]);
    }
  }

  removeFromFavourites(product: Product): void {
    this.favourites = this.favourites.filter(p => p.name !== product.name);
    this.updateStorage();
    this.favouritesSubject.next([...this.favourites]);
  }

  isFavourite(product: Product): boolean {
    return this.favourites.some(p => p.name === product.name);
  }

  getFavourites(): Product[] {
    return [...this.favourites];
  }

  getFavouritesCount(): number {
    return this.favourites.length;
  }

  toggleFavourite(product: Product): void {
    if (this.isFavourite(product)) {
      this.removeFromFavourites(product);
    } else {
      this.addToFavourites(product);
    }
  }

  private updateStorage(): void {
    localStorage.setItem('favourites', JSON.stringify(this.favourites));
  }

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

  clearFavourites(): void {
    this.favourites = [];
    this.updateStorage();
    this.favouritesSubject.next([]);
  }
}