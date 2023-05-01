import { InjectionToken, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './views/app/app.component';
import { IndexComponent } from './views/index/index.component';
import { NotFoundComponent } from './views/not-found/not-found.component';

import { HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule, HttpClientXsrfModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { GoogleMapsModule } from "@angular/google-maps";
import { RouterModule } from "@angular/router";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DataTablesModule } from 'angular-datatables';
import { ADDITIONAL_PROVIDERS } from 'src/environments/environment';
import { CoverageToggleComponent } from './embedabble/coverage-toggle/coverage-toggle.component';
import { DateElementDirective } from './embedabble/date-element.directive';
import { FormatTimePipe } from './embedabble/format-time.pipe';
import { PreviewMapComponent } from './embedabble/preview-map/preview-map.component';
import { HttpErrorHandler } from "./http-error-handler.service";
import { AuthorizationInterceptor } from './service/authorization.interceptor';
import { MessageService } from "./service/message.service";
import { UnauthorizedInterceptor } from "./service/unauthorized-interceptor";
import { ChallengeOverviewComponent } from './views/challenge-overview/challenge-overview.component';
import { OverviewMapComponent } from './views/challenge-overview/overview-map/overview-map.component';
import { CreateGameComponent } from './views/create-game/create-game.component';
import { DrawingManagerComponent } from './views/create-game/drawing-manager/drawing-manager.component';
import { DrawnGameFormComponent } from "./views/create-game/drawn-game-form/drawn-game-form.component";
import { HandPickedManagerComponent } from './views/create-game/hand-picked/hand-picked-manager.component';
import { HandpickedGameFormComponent } from './views/create-game/handpicked-game-form/handpicked-game-form.component';
import { GameCardComponent } from './views/home/game-card/game-card.component';
import { HomeChallengeFormComponent } from './views/home/home-challenge-form/home-challenge-form.component';
import { HomeComponent } from './views/home/home.component';
import { ChallengeFormComponent } from './views/index/challenge-form/challenge-form.component';
import { ChallengeScoresComponent } from './views/index/challenge-scores/challenge-scores.component';
import { InviteComponent } from './views/invite/invite.component';
import { NavbarComponent } from './views/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
    ChallengeFormComponent,
    ChallengeScoresComponent,
    ChallengeOverviewComponent,
    InviteComponent,
    FormatTimePipe,
    DateElementDirective,
    NavbarComponent,
    HomeComponent,
    PreviewMapComponent,
    HomeChallengeFormComponent,
    GameCardComponent,
    OverviewMapComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    RouterModule,
    FormsModule,
    NgbModule,
    DataTablesModule,
    GoogleMapsModule,
    HttpClientJsonpModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, trace: true, logOnly: !isDevMode(), autoPause: true}),
  ],
  providers: [
    HttpErrorHandler,
    MessageService,
    {provide: GOOGLE, useFactory: () => google},
    //TODO these handle the same concern and should be combined
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true
    },
    ADDITIONAL_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
