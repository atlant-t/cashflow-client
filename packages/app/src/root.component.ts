import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <button i18n="Button for user log out @@logoutButton" (click)="logout()">Logout</button>
    <router-outlet></router-outlet>
  `,
  styles: [':host {display: block}'],
})
export class RootComponent {
  constructor(
    public oidcSecurityService: OidcSecurityService,
  ) {}

  /** Logout current user */
  public logout() {
    this.oidcSecurityService.logoffAndRevokeTokens().pipe(finalize(() => {
      // In case of an error, we need to manually revoke the authorization data.
      this.oidcSecurityService.revokeAccessToken();
      this.oidcSecurityService.authorize();
    })).subscribe(() => {
      // Subscribing required to send request to the auth server.
    });
  }
}
