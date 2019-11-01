import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movies/movie.service';
import { IMovie } from '../movies/IMovie';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  pageTitle = 'Favorite Movies';
  favs: IMovie | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private movieService: MovieService) { }

  ngOnInit() {
    const cacheFavs = localStorage.getItem('favorites');
    if (cacheFavs.length > 0) {
      this.favs = JSON.parse(cacheFavs);
      console.log(this.favs);
    }
  }

  deleteMovie(mId: number, index: number) {
    console.log(mId, index);
    const fa = localStorage.getItem('favorites');
    const fav = JSON.parse(fa);
    console.log(fav[index].title, 'successfully deleted');
    fav.splice(index, 1);
    localStorage.removeItem('favorites');
    localStorage.setItem('favorites', JSON.stringify(fav));
    this.favs = fav;
    }
}
