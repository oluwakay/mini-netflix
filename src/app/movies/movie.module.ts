import { NgModule } from '@angular/core';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { SharedModule } from '../shared/shared.module';
import { SearchResultsComponent } from './search-results/search-results.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    MovieDetailsComponent,
    SearchResultsComponent,
  ],
})
export class MovieModule { }
