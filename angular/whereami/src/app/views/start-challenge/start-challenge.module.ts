import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GoogleMapsModule } from '@angular/google-maps';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from 'src/app/shared/shared.module';
import { challengeReducer } from './challenge-store/challenge.reducer';
import { GuessEffects } from './challenge-store/guess.effects';
import { RouteEffects } from './challenge-store/route.effects';
import { ScoreCalculationEffects } from './challenge-store/score-calculation.effects';
import { SoundEffects } from './challenge-store/sound.effects';
import { TimerEffects } from './challenge-store/timer.effects';
import { GamePanoComponent } from './game-pano/game-pano.component';
import { MiniMapComponent } from './mini-map/mini-map.component';
import { PlayedBeforeComponent } from './played-before/played-before.component';
import { RoundEndComponent } from './round-end/round-end.component';
import { RoundMapComponent } from './round-map/round-map.component';
import { ScoreBoardComponent } from './score-board/score-board.component';
import { StartChallengeRoutingModule } from './start-challenge-routing.module';
import { StartChallengeComponent } from './start-challenge.component';
import { StatusTableComponent } from './status-table/status-table.component';


@NgModule({
  declarations: [
    StartChallengeComponent,
    GamePanoComponent,
    MiniMapComponent,
    RoundMapComponent,
    StatusTableComponent,
    PlayedBeforeComponent,
    ScoreBoardComponent,
    RoundEndComponent
  ],
  imports: [
    GoogleMapsModule,
    CommonModule,
    StartChallengeRoutingModule,
    StoreModule.forFeature('challenge', challengeReducer),
    EffectsModule.forFeature([RouteEffects, GuessEffects, ScoreCalculationEffects, SoundEffects, TimerEffects]),
    SharedModule,
  ],
  //No exports!!!!
  exports: []
})
export class StartChallengeModule { }
