import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { isSpecificScopeType } from '@core/util/common.functions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AllowGenericScopesGuard implements CanActivate {
  constructor(private _location: Location) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const permission: boolean = !isSpecificScopeType();
    if (!permission) {
      this._location.back();
    }
    return permission;
  }
}
