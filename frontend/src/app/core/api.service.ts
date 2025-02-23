import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api/images';

  constructor(private http: HttpClient) {}

  getImages(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}?page=${page}&limit=${limit}`);
  }

  getImageById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getImagesWithTextMetadata(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/text-metadata?page=${page}&limit=${limit}`);
  }
}
