import { Component, OnInit, Input } from '@angular/core';
import { IMovie } from '../movies/IMovie';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movies/movie.service';
import { UserService } from '../shared/user.service';
import { Observable } from 'rxjs';
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
  movies: IMovie | undefined;
  movie: IMovie | undefined;
  prefix = 'https://image.tmdb.org/t/p/w500/';
  user: User;
  isFavorite = false;
  id: number;


  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private movieService: MovieService) { }

  ngOnInit() {

    this.getUserLoggedIn();

    if (!localStorage.getItem('user')) {
      this.router.navigate(['home']);
    }

    this.movieService.getMovies().subscribe({
      next: movies => {
        // const { results } = movies;
        this.movies = movies;
        console.log(this.movies);
      },
      error: err => this.errorMessage = err
    });
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
  }
  splitYear(releaseDate: string) {
    return releaseDate.split('-')[0];
  }

  goToSearch(search: string) {
    this.router.navigateByUrl(`/search?${search}`)
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


 }
