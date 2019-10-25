import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MovieResolved } from './IMovie';
import { MovieService } from './movie.service';

@Injectable({
  providedIn: 'root'
})
export class MovieResolver implements Resolve<MovieResolved> {

  constructor(private movieService: MovieService) { }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<MovieResolved> {
    const id = route.paramMap.get('id');
    if (isNaN(+id)) {
      const message = `Movie id was not a number: ${id}`;
      console.error(message);
      return of({ movie: null, error: message });
    }

    return this.movieService.getMovie(+id)
      .pipe(
        map(movie => ({ movie })),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ movie: null, error: message });
        })
      );
  }

}
