import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private router = inject(Router);

  images: string[] = [
    'https://media.istockphoto.com/id/1319142658/photo/black-baseball-hat.webp?a=1&b=1&s=612x612&w=0&k=20&c=6IZGnObNn3KUPGQXCENSnXtKxtDmg9V63DSksyBoQgE=',
    'https://media.istockphoto.com/id/636241652/photo/white-empty-baseball-cap.jpg?s=612x612&w=0&k=20&c=QjABC7pfgMAfUxcddaQT1TaOKc8kho0cR2Yl65CJRYI=',
    'https://media.istockphoto.com/id/1163958328/photo/trucker-hat-or-mesh-cap-isolated.jpg?s=612x612&w=0&k=20&c=BzcqPaIauBYBmPlAF-D7HJV6EOUTEhNfjIkXTYUUSlE='
  ];

  currentIndex: number = 0;

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToImage(index: number) {
    this.currentIndex = index;
  }

  navigateToCategory(category: string) {
    this.router.navigate([`/${category}`]);
  }
}