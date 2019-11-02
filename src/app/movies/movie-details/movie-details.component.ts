import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IMovie, ITrailers, ICast, MovieResolved } from '../IMovie';
import { MovieService } from '../movie.service';
import { UserService } from 'src/app/shared/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  pageTitle = 'Movie Detail';
  errorMessage = '';
  movie: IMovie | undefined;
  trailer: ITrailers | undefined;
  cast: ICast | undefined;

  constructor(private route: ActivatedRoute,
              private movieService: MovieService,
              public sanitizer: DomSanitizer) { }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getMovieById(id);
      this.getCasts(id);
      this.getTrailer(id);
    }

    // const resolvedData: MovieResolved =
    // this.route.snapshot.data['resolvedData'];
    // this.errorMessage = resolvedData.error;
    // this.onProductRetrieved(resolvedData.movie);

    // const vidId = +param;
    // const data: IMovie[] = JSON.parse(localStorage.getItem('results'));
    // console.log('from localstorage: ', data);
    // data.find(v => v.id === vidId);
    // this.movie = data;
}

onProductRetrieved(movie: IMovie): void {
  this.movie = movie;

  if (this.movie) {
    this.pageTitle = `Movie Detail: ${this.movie.title}`;
  } else {
    this.pageTitle = 'No movie found';
  }
}

  onRatingClicked(message: string): void {
    this.pageTitle = 'Product List: ' + message;
  }
  getMovieById(id: number) {
    const cached = localStorage.getItem('movies');
    if (cached !== null) {
      const cachedMovies = JSON.parse(cached);
      const arr = Object.keys(cachedMovies).map((key) => {
        return Number(key), cachedMovies[key];
      });
      this.movie = arr.find(v => v.id === id);
      console.log(this.movie);
    } else {
      this.movieService.getMovie(id).subscribe(
        movie => this.movie = movie,
        error => this.errorMessage = error as any);
      }
  }

  getCasts(id: number) {
    this.movieService.getCast(id).subscribe({
      next: casts => {
        this.cast = casts;
        console.log(this.cast);
      },
      error: err => this.errorMessage = err
    });
  }

  getTrailer(id: number) {
    this.movieService.getTrailer(id).subscribe({
      next: trailers => {
        this.trailer = trailers;
        console.log(trailers);
      },
      error: err => this.errorMessage = err
    });
  }
}
