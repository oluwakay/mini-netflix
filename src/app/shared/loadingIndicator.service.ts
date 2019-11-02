import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingIndicatorService {
  public isLoading = false;
  constructor(
  ) {
  }

}
