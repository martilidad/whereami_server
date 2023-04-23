import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs';
import { GOOGLE } from 'src/app/app.module';
import { GameState } from 'src/app/model/status/game-state';
import { ActionTypes, EndedRound, GuessCalculated, GuessChanged } from './challenge.actions';
import { selectRemainingTime } from './challenge.selectors';
import { LatLngImpl } from 'src/app/model/lat-lng';
import { ChallengeLocation } from '@client/models';


export const MAX_POINT_DISTANCE = 10000;
/**
 * Min distance for at least one point.
 */
const LAST_POINT_DISTANCE = 14000;

@Injectable()
export class ScoreCalculationEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{ challenge: GameState }>,
    @Inject(GOOGLE) private google_ns: any//: typeof google
  ) {}

  private calcDistanceKm(from: google.maps.LatLng, to: ChallengeLocation): number {
    const meters = this.google_ns.maps.geometry.spherical.computeDistanceBetween(from,
      new this.google_ns.maps.LatLng(to.lat, to.long));
    return Math.floor(meters / 10) / 100;
  }



  startRound$ = createEffect(() => this.actions$.pipe(
    ofType(ActionTypes.GuessChanged),
    withLatestFrom(this.store.select(state => state.challenge)),
    map(([action, state]: [GuessChanged, GameState]) => {
      const distance: number = this.calcDistanceKm(action.guess, state.challenge!.locations[state.round.index!]);
      const score = Math.floor(MAX_POINT_DISTANCE ** (1 - distance / LAST_POINT_DISTANCE));
      return new GuessCalculated(distance, score);
    }))
);

}
