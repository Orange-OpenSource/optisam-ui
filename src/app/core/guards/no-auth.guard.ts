// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

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
