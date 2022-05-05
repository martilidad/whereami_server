import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './views/app/app.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { IndexComponent } from './views/index/index.component';

import { RouterModule } from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule, HttpClientXsrfModule} from "@angular/common/http";
import {HttpErrorHandler} from "./http-error-handler.service";
import {MessageService} from "./service/message.service";
import {FormsModule} from "@angular/forms";
import {ApiInterceptor} from "./service/api-interceptor";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import { CreateGameComponent } from './views/create-game/create-game.component';
import {GoogleMapsModule} from "@angular/google-maps";
import { CoverageToggleComponent } from './embedabble/coverage-toggle/coverage-toggle.component';
import { DrawingManagerComponent } from './embedabble/drawing-manager/drawing-manager.component';
import { HandPickedManagerComponent } from './embedabble/hand-picked/hand-picked-manager.component';
import {DrawnGameFormComponent} from "./views/create-game/drawn-game-form/drawn-game-form.component";
import { HandpickedGameFormComponent } from './views/create-game/handpicked-game-form/handpicked-game-form.component';
import { StartChallengeComponent } from './views/start-challenge/start-challenge.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    IndexComponent,
    CreateGameComponent,
    CoverageToggleComponent,
    DrawingManagerComponent,
    HandPickedManagerComponent,
    DrawnGameFormComponent,
    HandpickedGameFormComponent,
    StartChallengeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    NgbModule,
    DataTablesModule,
    GoogleMapsModule,
    HttpClientJsonpModule
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
