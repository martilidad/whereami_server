

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SoundService } from 'src/app/service/sound/sound.service';
import { ActionTypes } from './challenge.actions';
import { Subject, filter, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { GameState } from 'src/app/model/status/game-state';
import { selectRemainingTime } from './challenge.selectors';


@Injectable()
export class SoundEffects {
  constructor(
    private actions$: Actions,
    private soundService: SoundService,
    private store: Store<{ challenge: GameState }>
  ) { }

  startRound$ = createEffect(
    () => this.actions$.pipe(
      ofType(ActionTypes.NextRound, ActionTypes.Start),
      tap(() => this.soundService.start())
    ),
    { dispatch: false }
  );

  changeGuess$ = createEffect(
    () => this.actions$.pipe(
      ofType(ActionTypes.GuessChanged),
      tap(() => this.soundService.pin())
    ),
    { dispatch: false }
  );

  private timerEndObservable = new Subject();
  tenSeconds$ = createEffect(
    () => this.actions$.pipe(
      ofType(ActionTypes.DecrementTimer),
      switchMap(() => this.store.select(selectRemainingTime)),
      filter((time) => time === 10),
      tap(() => this.soundService.tenSeconds(this.timerEndObservable))
    ),
    { dispatch: false }
  );
  cancelTenSeconds$ = createEffect(() => this.actions$.pipe(
    ofType(ActionTypes.EndedRound),
    tap(() => this.timerEndObservable.next({}))
  ),
    { dispatch: false }
  );
}
