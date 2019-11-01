import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { IMovie, ICast, ITrailers } from './IMovie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private url = 'https://api.themoviedb.org/3/movie/';
  private movieslistUrl = 'https://api.themoviedb.org/4/list/?page=1&api_key=0180207eb6ef9e35482bc3aa2a2b9672';
  private searchUrl = 'https://api.themoviedb.org/3/search/movie';
  private apiKey = '0180207eb6ef9e35482bc3aa2a2b9672';
  private lang = 'en-US';

  constructor(private http: HttpClient) { }

  getMovies(): Observable<IMovie> {
    const moviesUrl = `${this.url}popular?api_key=${this.apiKey}&language=${this.lang}`;
    return this.http.get<IMovie>(moviesUrl)
    .pipe(
      map(this.extractData),
      // tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.handleError)
      );
  }
  getMovie(id: number): Observable<IMovie> {
    const detailsUrl = `${this.url}${id}?api_key=${this.apiKey}&language=${this.lang}`;
    return this.http.get<IMovie>(detailsUrl)
      .pipe(
        tap(data => console.log('getMovie: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }
  searchMovies(queryString: string): Observable<IMovie[]> {
    const search = `${this.searchUrl}?api_key=${this.apiKey}&language=${this.lang}&query=${queryString}`;
    return this.http.get<IMovie[]>(search)
    .pipe(
      tap(data => console.log('searchResults: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }
  getTrailer(id: number): Observable<ITrailers> {
    const url = `${this.url}${id}$/videos?api_key=${this.apiKey}&language=${this.lang}`;
    return this.http.get<ITrailers>(url)
      .pipe(
        tap(data => console.log('getTrailers: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }
  public watchYoutubeTrailer(movie: IMovie) {
    const searchPhrase = encodeURI(`${movie.title} ${movie.release_date.split('-')[0]} Official Trailer`);
    window.location.href = 'https://www.youtube.com/results?search_query=' + searchPhrase;
  }
  getCast(id: number): Observable<ICast> {
    const url = `${this.url}${id}/credits?api_key=${this.apiKey}`;
    return this.http.get<ICast>(url)
      .pipe(
        tap(data => console.log('getCast: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }



  addMovie(newMovie: IMovie): Observable<IMovie> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const moviesUrl = 'https://api.themoviedb.org/3/movie/popular?api_key=0180207eb6ef9e35482bc3aa2a2b9672&language=en-US';
    newMovie.id = null;
    return this.http.post<IMovie>(moviesUrl, newMovie, { headers })
      .pipe(
        tap(data => console.log('addMovie: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteMovie(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.url}/${id}`;
    return this.http.delete<IMovie>(url, { headers })
      .pipe(
        tap(data => console.log('deleteMovie: ' + id)),
        catchError(this.handleError)
      );
  }

  updateMovie(updatedMovie: IMovie): Observable<IMovie> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.url}/${updatedMovie.id}`;
    return this.http.put<IMovie>(url, updatedMovie, { headers })
      .pipe(
        tap(() => console.log('updatedMovie: ' + updatedMovie.id)),
        // Return the movie on an update
        map(() => updatedMovie),
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  private extractData(res) {
    const body = res;

    let data;
    if (body.results !== undefined) {
      data = body.results;
    } else {
      data = null;
    }

    if (data != null) {

      try {
        let movieCache = {};

        if (!localStorage.getItem('movies')) {
          console.log('no movies cached yet');
          Object.keys(data).forEach(i => {
            movieCache[data[i].id] = data[i];
          });
          localStorage.setItem('movies', JSON.stringify(movieCache));
          // sessionStorage.setItem('movies', JSON.stringify(movieCache));
        } else {
          console.log('merge/update cache data');
          movieCache = JSON.parse(localStorage.getItem('movies'));
          Object.keys(data).forEach(i => {
            movieCache[data[i].id] = data[i];
          });
          localStorage.setItem('movies', JSON.stringify(movieCache));
          // sessionStorage.setItem('movies', JSON.stringify(movieCache));
        }

      } catch (e) {
        // an error with caching should not halt the program
        console.log('error caching movie info');
      }
    }

    return body.results || {};
  }

  // getBatchDetails(movieIDs: any[]) {
  //   // AN EXPENSIVE FUNCTION, use sparingly. unfortunately TMDB does not offer a way to string multiple ids;
  //   let movieCache = {};
  //   const movieFetchTasks = [];
  //   movieIDs.forEach((id, index) => {
  //     if (index > 25) {
  //       return; // limit to 25 requests (optional);
  //     }

  //     this.getMovie(id).subscribe(data => {
  //       if (!localStorage.getItem('movies')) {
  //         console.log('no movies cached yet');
  //         movieCache[data['id']] = data;
  //         localStorage.setItem('movies', JSON.stringify(movieCache));
  //       } else {
  //         console.log('merge/update cache data');
  //         movieCache = JSON.parse(localStorage.getItem('movies'));
  //         movieCache[data['id']] = data;
  //         localStorage.setItem('movies', JSON.stringify(movieCache));
  //       }

  //     });

  //   });
  // }

}
