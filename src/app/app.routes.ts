import { Routes } from '@angular/router';
import { BuyComponent } from './buy/buy.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { FavouritesComponent } from './favourites/favourites.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { path: 'classic', loadComponent: () => import('./classic/classic.component').then(m => m.ClassicComponent) },
    { path: 'snapback', loadComponent: () => import('./snapbackit/snapbackit.component').then(m => m.SnapbackitComponent) },
    { path: 'truck', loadComponent: () => import('./truckerit/truckerit.component').then(m => m.TruckeritComponent) },
    { path: 'product/:category/:name', loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
    { path: 'buy/:name', loadComponent: () => import('./buy/buy.component').then(m => m.BuyComponent) },
    { path: 'favourites', component: FavouritesComponent },
];