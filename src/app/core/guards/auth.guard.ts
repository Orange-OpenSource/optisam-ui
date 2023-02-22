import { Injectable, Input } from '@angular/core';
import {
  CanActivate,
  NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const currentRole = localStorage.getItem('role');
    if (localStorage.getItem('access_token')) {
      const token = JSON.parse(
        atob(localStorage.getItem('access_token').split('.')[1])
      );
      if (token.exp * 1000 > Date.now()) {
        if (
          route.data &&
          route.data.roles &&
          route.data.roles.indexOf(currentRole) === -1
        ) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      }
    }
    this.router.navigate(['/']);
    return false;
  }
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem('token');
    if (localStorage.getItem('token')) {
      this.router.navigate(['/not-found']);
    } else {
      this.router.navigate(['/login']);
    }
    return false;
  }
}
