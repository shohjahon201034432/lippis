// buy.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-buy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductsService);

  product: Product | null = null;

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');

    if (name) {
      this.product = this.productService.getProductByName(name);

      if (!this.product) {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}