

import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Challenge } from '@client/models';
import { createEffect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { ChallengesService } from '@service/challenge/challenges.service';
import { filter, map, switchMap } from 'rxjs';
import { GameState, RoundState } from 'src/app/model/status/game-state';
import { PlayedBefore, Start } from './challenge.actions';


@Injectable()
export class RouteEffects {
  constructor(
    private route: ActivatedRoute,
    private challengesService: ChallengesService) { }

  loadChallengeOnNavigation$ = createEffect(
    () =>     this.route.queryParams.pipe(
      filter(params => params['id'] != null),
      switchMap(params => {
      const id = params['id']
      const ignorePreviousGuesses = params['ignorePreviousGuesses'] ? params['ignorePreviousGuesses'] : false
      return this.challengesService.getChallenge(id!).pipe(map(value => this.resultAction(value, ignorePreviousGuesses!)))
    })
    )
  );

  private resultAction(challenge: Challenge, ignorePreviousGuesses: boolean): Action {
    let firstUnplayed = ignorePreviousGuesses ? 0 : challenge.locations.findIndex(location => !location.guessed);
    if (firstUnplayed === -1) {
      return new PlayedBefore(challenge);
    }
    return new Start(new GameState(new RoundState(firstUnplayed, challenge.time), challenge))
  }
}
