import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './views/app/app.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { IndexComponent } from './views/index/index.component';

import { RouterModule } from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from "@angular/common/http";
import {HttpErrorHandler} from "./http-error-handler.service";
import {MessageService} from "./service/message.service";
import {FormsModule} from "@angular/forms";
import {ApiInterceptor} from "./service/api-interceptor";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    NgbModule,
    DataTablesModule
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
