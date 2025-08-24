import { MainLayout } from './layout/main-layout/main-layout';
import { Routes } from '@angular/router';
import { Attractions } from './pages/attractions/attractions';
import { Favorites } from './pages/favorites/favorites';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'attractions', component: Attractions },
      { path: 'favorites', component: Favorites },
      { path: '', redirectTo: 'attractions', pathMatch: 'full' },
    ],
  },
];
