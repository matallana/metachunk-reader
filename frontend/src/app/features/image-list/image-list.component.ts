import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-image-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit {
  images: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.apiService.getImages().subscribe({
      next: (data) => {
        this.images = data.results;
      },
      error: (err) => {
        console.error('Error fetching images:', err);
      }
    });
  }
}
