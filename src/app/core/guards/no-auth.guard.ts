import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate() {
      if (!localStorage.getItem('access_token')) {
          return true;
      } else {
          const token = localStorage.getItem('access_token').split('.')[1];
          if (JSON.parse(atob(token)).exp * 1000 < Date.now()) {
              return true;
          }
      }

      this.router.navigate(['/optisam/dashboard']);
      return false;
  }
}
