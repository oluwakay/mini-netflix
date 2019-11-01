import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { SelectiveStrategy } from './selective-strategy.service';
import { MovieResolver } from './movies/movie-resolver.service';
import { FavoritesComponent } from './favorites/favorites.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent },
  {
    path: 'movies/favorites',
    component: FavoritesComponent
  },
  {
    path: 'movies/:id',
    component: MovieDetailsComponent,
    resolve: { resolvedData: MovieResolver }
  },
  {
    path: 'movies',
    // canActivate: [AuthGuard],
    data: { preload: false },
    loadChildren: () =>
      import('./movies/movie.module').then(m => m.MovieModule)
  },
  {path: '', pathMatch:  'full', redirectTo: 'home'},
  {path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: SelectiveStrategy })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
