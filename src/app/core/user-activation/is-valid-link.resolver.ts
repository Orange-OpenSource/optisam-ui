import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { QP } from "@core/util/constants/constants";
import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";

interface UserActivationResolver {
    invalid: boolean,
    user: string;
    token: string;
}

@Injectable({ providedIn: 'root' })
export class IsValidLinkResolver implements Resolve<UserActivationResolver> {
    constructor() { }

    resolve(route: ActivatedRouteSnapshot): Observable<UserActivationResolver> {
        const user = route.queryParamMap.get(QP.user)
        const token = route.queryParamMap.get(QP.token)
        const type = route.data?.type;
        return of({ invalid: !user || !token }).pipe(
            map(res => {
                
                return {
                    invalid: res.invalid,
                    user,
                    token,
                    type
                }

            })
        )
    }
}