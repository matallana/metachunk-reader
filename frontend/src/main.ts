import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { ImageListComponent } from './app/features/image-list/image-list.component';
import { ImageDetailComponent } from './app/features/image-detail/image-detail.component';

const routes: Routes = [
  { path: '', component: ImageListComponent },
  { path: 'image/:id', loadComponent: () => import('./app/features/image-detail/image-detail.component').then(m => m.ImageDetailComponent) },
  { path: '**', redirectTo: '' }  // Redirige rutas desconocidas a la lista de imágenes
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
