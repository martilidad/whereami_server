
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ChallengeStatusService } from '@service/challenge-status/challenge-status.service';
import { AUTOSTART, SettingsService } from '@service/settings/settings.service';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs';
import { GameState } from 'src/app/model/status/game-state';
import { PlayStatus } from 'src/app/model/status/play-status';
import { UserChallengeStatus } from 'src/app/model/status/user-challenge-status';
import { ActionTypes, BindStatusWorker, NextRound } from './challenge.actions';
import {
  selectChallengeId,
  selectChallengeStatusWorker,
  selectFinished,
  selectRound,
  selectRoundEnded
} from './challenge.selectors';

@Injectable()
export class StatusEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{ challenge: GameState }>,
    private challengeStatusService: ChallengeStatusService,
    private settingsService: SettingsService
  ) {}

  createWorker$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.Start),
      switchMap(() => this.store.select(selectChallengeId)),
      filter((id) => id != null && id != undefined),
      map((id) => new BindStatusWorker(this.challengeStatusService.bind(id!)))
    )
  );

  updateStatus$ = createEffect(
    () =>
      this.store.select(selectChallengeStatusWorker).pipe(
        filter(Boolean),
        withLatestFrom(
          this.store.select(selectRoundEnded),
          this.store.select(selectRound).pipe(filter((round) => round != null))
        ),
        tap(([worker, roundEnded, round]) =>
          worker.postStatus({
            round: round!,
            status: roundEnded ? PlayStatus.ROUND_END : PlayStatus.PLAYING,
          })
        )
      ),
    { dispatch: false }
  );

  autoStartRound$ = createEffect(() =>
    this.store.select(selectChallengeStatusWorker).pipe(
      filter(Boolean),
      switchMap((worker) => worker.statusObservable),
      withLatestFrom(
        this.store.select(selectRound).pipe(filter((round) => round != null)),
        this.store.select(selectRoundEnded).pipe(filter(Boolean)),
        this.store.select(selectFinished).pipe(filter(finished => !finished))
      ),
      filter(
        ([statuses, round]) => this.settingsService.load(AUTOSTART) &&
          [...statuses.values()].some(
            (otherStatus: UserChallengeStatus) =>
              otherStatus.status == PlayStatus.PLAYING &&
              otherStatus.round == round! + 1
          )
      ),
      map(() => new NextRound())
    )
  );
}
