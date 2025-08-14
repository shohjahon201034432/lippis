import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { path: 'classic', loadComponent: () => import('./classic/classic.component').then(m => m.ClassicComponent) },
    { path: 'snapbackit', loadComponent: () => import('./snapbackit/snapbackit.component').then(m => m.SnapbackitComponent) },
    { path: 'truckerit', loadComponent: () => import('./truckerit/truckerit.component').then(m => m.TruckeritComponent) },
];
