import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2JsonTreeModule } from 'ng2-json-tree';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Ng2JsonTreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
