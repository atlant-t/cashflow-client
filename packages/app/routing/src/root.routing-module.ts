import { NgModule, Injector, ApplicationInitStatus } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';
import { OidcSecurityService, AbstractSecurityStorage } from 'angular-auth-oidc-client';
import { from, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ContentModule, ContentComponent } from 'app/content';
import { REDIRECT_URL } from './token/redirect-url.token';
import { AuthGuard, REDIRECT_URL_STORE_KEY } from './guard/auth.guard';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  canActivate: [AuthGuard],
  component: ContentComponent,
}, {
  path: '**',
  canActivate: [AuthGuard],
  component: ContentComponent,
}];

/**
 * Factory for identify the URL that was saved before authentication.
 * @param storage Storage that to use angular-auth-oidc-client
 */
export function getRedirectUrl(storage: AbstractSecurityStorage) {
  const targetUrl: string = storage.read(REDIRECT_URL_STORE_KEY) || null;
  // After receiving, we delete the URL,
  // as it is needed only after authorization.
  storage.write(REDIRECT_URL_STORE_KEY, null);
  return targetUrl;
}

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // We need to initialize the routing after checking the authorization,
      // since the checkAuth() method kicks off the complete setup flow
      // and we need to wait for it to finish before the defender checks it.
      initialNavigation: false,
    }),
    ContentModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: REDIRECT_URL,
      useFactory: getRedirectUrl,
      deps: [AbstractSecurityStorage],
    },
  ],
  exports: [
    RouterModule,
  ],
})
export class RootRoutingModule {
  constructor(
    private _injector: Injector,
    private _router: Router,
    private _init: ApplicationInitStatus,
    private _oidcSecurityService: OidcSecurityService,
  ) {
    if (this._oidcSecurityService === null) {
      throw new Error('Missing angular-auth-oidc-client dependency\n'
                    + 'Add AuthModule.forRoot() to main app module.'
      );
    }

    this._restoreUrlAfterLogin();
  }

  private _restoreUrlAfterLogin() {
    combineLatest([
      // We need to wait until the initialization is complete,
      // since the angular-auth-oidc-client library
      // must be configured at this time.
      from(this._init.donePromise),
    ]).pipe(
      switchMap(() => this._oidcSecurityService.checkAuth()),
      // We get URL from the injector after initialization,
      // to be sure that Storage has been initialized
      // in the angular-auth-oidc-client library.
      map(() => this._injector.get(REDIRECT_URL)),
    ).subscribe(startUrl => {
      if (!!startUrl) {
        this._router.navigateByUrl(startUrl);
      }
      this._router.initialNavigation();
    });
  }
}
