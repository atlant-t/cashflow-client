import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OidcSecurityService, AbstractSecurityStorage } from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';

/** The key in the store that stores the saved URL */
export const REDIRECT_URL_STORE_KEY = 'redirect_url';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _oidcSecurityService: OidcSecurityService,
    private _storage: AbstractSecurityStorage,
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._oidcSecurityService.checkAuth().pipe(
      map((isAuthorized: boolean) => {
        if (!isAuthorized) {
          // If the user is not authorized.
          // We need to save the current URL,
          // in order to restore it later during
          // routing initialization.
          this._storage.write(REDIRECT_URL_STORE_KEY, state.url);
          this._oidcSecurityService.authorize();
          return false;
        }
        return true;
      }),
    );
  }
}
