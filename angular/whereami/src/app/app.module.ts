import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { IndexComponent } from './index/index.component';
import { TestComponent } from './test/test.component';

import { RouterModule } from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from "@angular/common/http";
import {HttpErrorHandler} from "./http-error-handler.service";
import {MessageService} from "./message.service";
import {FormsModule} from "@angular/forms";
import {ApiInterceptor} from "./api-interceptor";
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    IndexComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule,
    AppRoutingModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    HttpErrorHandler,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
