import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
            return this.checkLoggedIn(state.url);

    }

    checkLoggedIn(url: string): boolean {
        if (this.authService.isLoggedIn && localStorage.getItem('user')) {
          return true;
        }
        this.authService.redirectUrl = url;
        this.router.navigate(['/home']);
        return false;
      }
}
