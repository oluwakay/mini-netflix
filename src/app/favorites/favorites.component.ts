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
    if (!cacheFavs) {
      this.router.navigate(['home']);
    }
    if (cacheFavs) {
      this.favs = JSON.parse(cacheFavs);
      console.log(this.favs);
    }

  }

}
