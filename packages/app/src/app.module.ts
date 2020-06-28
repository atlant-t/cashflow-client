import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RootRoutingModule } from 'app/routing';
import { RootComponent } from './root.component';

@NgModule({
  declarations: [
    RootComponent,
  ],
  imports: [
    BrowserModule,
    RootRoutingModule,
  ],
  bootstrap: [
    RootComponent,
  ],
})
export class AppModule { }
