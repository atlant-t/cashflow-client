import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationComponent, AuthenticationModule } from 'app/authentication';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  component: AuthenticationComponent,
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AuthenticationModule,
  ],
  exports: [
    RouterModule,
  ],
})
export class AuthenticationRoutingModule { }
