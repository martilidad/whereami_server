import { Injectable } from '@angular/core';
import { CodeEnum, Guess } from '@client/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchApiErrorCode } from '@service/api-helper';
import { GuessService } from '@service/guess/guess.service';
import { of } from 'rxjs';
import {
  first,
  map,
  switchMap
} from 'rxjs/operators';
import { GameState } from 'src/app/model/status/game-state';
import {
  ActionTypes,
  RefreshMap
} from './challenge.actions';

@Injectable()
export class GuessEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{ challenge: GameState }>,
    private guessService: GuessService
  ) {}

  guess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.EndedRound),
      switchMap(() => this.store.select((state) => state.challenge).pipe(first())),
      switchMap((state) => {
        let guess: Guess = {
          id: null,
          pub_date: null,
          lat: state.round.guess!.lat(),
          long: state.round.guess!.lng(),
          distance: state.round.distance,
          score: state.round.score,
          username: 'You(Not on Server)',
        };
        return this.guessService
          .submitGuess(state.challenge!.locations[state.round.index!].id!, guess)
          .pipe(catchApiErrorCode(CodeEnum.Exists, () => of(guess)));
      }),
      map((guess: Guess) => {
        if (!guess.id) {
          return new RefreshMap(guess);
        }
        return new RefreshMap();
      })
    )
  );
}
