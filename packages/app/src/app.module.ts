import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RootRoutingModule } from 'app/routing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthModule, OidcConfigService, OpenIdConfiguration } from 'angular-auth-oidc-client';
import { RootComponent } from './root.component';
import { switchMap, catchError } from 'rxjs/operators';
import { from } from 'rxjs';

/**
 * Factory to configure angular-auth-oidc-client library
 * using http request to config/auth.json
 */
export function configureAuth(http: HttpClient, oidcConfigService: OidcConfigService) {
  return async () => {
    return http.get<OpenIdConfiguration>('config/auth.json').pipe(
      catchError(e => {
        throw new Error('Cannot get configuration for angular-auth-oidc-client.\n'
                      + 'Please check if config/auth.json file exist');
      }),
      switchMap(config => from(oidcConfigService.withConfig(config)))
    ).toPromise();
  };
}

@NgModule({
  declarations: [
    RootComponent,
  ],
  imports: [
    BrowserModule,
    RootRoutingModule,
    HttpClientModule,
    AuthModule.forRoot(),
  ],
  bootstrap: [
    RootComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth,
      deps: [HttpClient, OidcConfigService],
      multi: true,
    },
  ],
})
export class AppModule { }
