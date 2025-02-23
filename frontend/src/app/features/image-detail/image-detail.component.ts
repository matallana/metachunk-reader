import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card'; 
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-image-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule], 
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.scss'] 
})
export class ImageDetailComponent implements OnInit {
  image: any;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getImageById(id).subscribe({
        next: (data) => this.image = data,
        error: (err) => console.error('Error fetching image:', err)
      });
    }
  }
}
