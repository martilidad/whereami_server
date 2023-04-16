import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import {
  filter,
  map,
  mapTo,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import { interval } from 'rxjs';
import { ActionTypes, DecrementTimer, EndedRound } from './challenge.actions';
import { Store } from '@ngrx/store';
import { GameState } from 'src/app/model/status/game-state';
import { selectRemainingTime } from './challenge.selectors';

@Injectable()
export class TimerEffects {
  constructor(private actions$: Actions, private store: Store<{ challenge: GameState }>) {}

  timer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.Start, ActionTypes.NextRound),
      switchMap(() =>
        interval(1000).pipe(
          map(() => new DecrementTimer()),
          takeUntil(this.actions$.pipe(ofType(ActionTypes.EndedRound)))
        )
      )
    )
  );

  timeRunsOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.DecrementTimer),
      switchMap(() => this.store.select(status => status.challenge.round)),
      filter(round => !round.ended && round.remainingTime === 0),
      map(() => new EndedRound())
    )
  );


}
