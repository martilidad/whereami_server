import { InjectionToken, NgModule } from '@angular/core';
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import { CreateGameComponent } from './views/create-game/create-game.component';
import {GoogleMapsModule} from "@angular/google-maps";
import { CoverageToggleComponent } from './embedabble/coverage-toggle/coverage-toggle.component';
import { DrawingManagerComponent } from './views/create-game/drawing-manager/drawing-manager.component';
import { HandPickedManagerComponent } from './views/create-game/hand-picked/hand-picked-manager.component';
import {DrawnGameFormComponent} from "./views/create-game/drawn-game-form/drawn-game-form.component";
import { HandpickedGameFormComponent } from './views/create-game/handpicked-game-form/handpicked-game-form.component';
import { StartChallengeComponent } from './views/start-challenge/start-challenge.component';
import { StatusTableComponent } from './views/start-challenge/status-table/status-table.component';
import { MiniMapComponent } from './views/start-challenge/mini-map/mini-map.component';
import { GamePanoComponent } from './embedabble/game-pano/game-pano.component';
import { ChallengeFormComponent } from './views/index/challenge-form/challenge-form.component';
import { ChallengeScoresComponent } from './views/index/challenge-scores/challenge-scores.component';
import { RoundMapComponent } from './embedabble/round-map/round-map.component';
import { ChallengeOverviewComponent } from './views/challenge-overview/challenge-overview.component';
import { ADDITIONAL_PROVIDERS } from 'src/environments/environment';
import { InviteComponent } from './views/invite/invite.component';
import { FormatTimePipe } from './embedabble/format-time.pipe';
import { UnauthorizedInterceptor } from "./service/unauthorized-interceptor";
import { DateElementDirective } from './embedabble/date-element.directive';
import { NavbarComponent } from './views/navbar/navbar.component';
export const GOOGLE = new InjectionToken('google');

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
    StartChallengeComponent,
    StatusTableComponent,
    MiniMapComponent,
    GamePanoComponent,
    ChallengeFormComponent,
    ChallengeScoresComponent,
    RoundMapComponent,
    ChallengeOverviewComponent,
    InviteComponent,
    FormatTimePipe,
    DateElementDirective,
    NavbarComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule,
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
    {provide: GOOGLE, useFactory: () => google},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    ADDITIONAL_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
