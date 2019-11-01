import { Component, OnInit, Input } from '@angular/core';
import { IMovie } from '../movies/IMovie';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movies/movie.service';
import { AuthService } from '../shared/auth.service';
import { User } from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pageTitle = 'Popular Movies';
  errorMessage = '';
  movies: IMovie[];
  filteredMovies: IMovie[];
  movie: IMovie | undefined;
  prefix = 'https://image.tmdb.org/t/p/w500/';
  user: User;
  isFavorite: boolean;
  id: number;
  _searchString: string;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private movieService: MovieService) { }

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.has('searchString')) {
      this.searchString = this.route.snapshot.queryParamMap.get('searchString');

    } else {
      this.filteredMovies = this.movies;
    }

    this.getUserLoggedIn();

    if (!localStorage.getItem('user')) {
      this.router.navigate(['home']);
    }

    const cache = localStorage.getItem('movies');
    // const cache = sessionStorage.getItem('movies');
    if (cache !== null) {
      const obj = JSON.parse(cache);
      // const arr = [];
      const arr = Object.keys(obj).map((key) => {
        return Number(key), obj[key];
      });
      console.log(arr);
      this.movies = arr;
      this.filteredMovies = this.movies;
    } else {
      this.movieService.getMovies().subscribe({
          next: movies => {
            // const { results } = movies;
            this.movies = movies;
            console.log(this.movies);
          },
          error: err => this.errorMessage = err
        });
    }
  }

  get searchString(): string {
    return this._searchString;
  }
  set searchString(value: string) {
    this._searchString = value;
    this.filteredMovies = this.performFilter(value);
    // this.filteredMovies = this.searchString ? this.performFilter(this.searchString) : this.movies;
  }

  performFilter(filterBy: string): IMovie[] {
    filterBy = filterBy.toLocaleLowerCase();
    console.log(filterBy);
    return this.movies.filter((m: IMovie) =>
      m.title.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
    this.router.navigate(['/home']);
  }

  getUserLoggedIn() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  logOut() {
    this.authService.logout();
    this.router.navigate(['/home']);
    this.user = null;
  }
  cacheFAvoritesById(id: number) {
    // localStorage.getItem('results');
    let favorites = [];
    const data = JSON.parse(localStorage.getItem('movies'));
    console.log(data[id]);

    const favCache = localStorage.getItem('favorites');
    console.log(favCache);
    if (favCache) {
      const fav = JSON.parse(favCache);
      console.log(fav);
      favorites = [...fav];
    }
    const m = [data[id]];
    const merged = [...favorites, ...m];
    // favorites.push(data[id]);
    console.log(merged);
    localStorage.setItem('favorites', JSON.stringify(merged));
  }

  favButton(mId: number, index: number) {
    this.id = mId;
    this.cacheFAvoritesById(mId);
    console.log('favorites: ', mId, index);
    if (!this.isFavorite) {
      return this.isFavorite = true;
    }
    if (this.isFavorite) {
      return this.isFavorite = false;
    }
  }

  // onClick(mId: number) {
  //   this.router.navigate(['/movies', mId], {
  //     queryParams: { search: this.searchString }
  //   });
  // }

 }
