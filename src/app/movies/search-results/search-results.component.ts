import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  searchQuery = '';
  searchResults: Observable<any> | undefined;
  errorMessage = '';

  constructor(private route: ActivatedRoute,
              private movieService: MovieService) {}

  ngOnInit() {
      // this.route.queryParams.debounceTime(500).distinctUntilChanged().subscribe(params => {
      //   // perform search here and bind result to template only after the input has changed and 500ms have passed
      //   const query = params.query;
      //   this.searchMovieDb(query);
      // });
  }

  searchMovieDb(queryString) {
    queryString = this.searchQuery.toLocaleLowerCase();
    this.movieService.searchMovies(queryString).subscribe({
      next: movies => {
        const { results } = movies;
        this.searchResults = results;
        console.log(this.searchResults);
      },
      error: err => this.errorMessage = err
    });
  }

}
