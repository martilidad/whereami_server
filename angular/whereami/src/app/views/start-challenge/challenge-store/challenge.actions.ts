import { Challenge, Guess } from '@client/models';
import { Action } from '@ngrx/store';
import { BoundChallengeStatusService } from '@service/challenge-status/challenge-status.service';
import { LatLng, LatLngImpl } from 'src/app/model/lat-lng';
import { GameState } from 'src/app/model/status/game-state';

//TODO fix wording; past should only be used if the action actually is a post action hook and not the action itself
export enum ActionTypes {
  PlayedBefore = '[Challenge] was played before',
  Start = '[Challenge] starts',
  NextRound = '[Challenge] next round',
  EndedRound = '[Challenge] ended round',
  DecrementTimer = '[Challenge] decrement timer',
  GuessChanged = '[Challenge] guess changed',
  GuessCalculated = '[Challenge] guess calculated',
  RefreshMap = '[Challenge] map refresh requested',
  ToStart = '[Challenge] to start',
  BindStatusWorker = '[Challenge] bind status worker'
}

//TODO is this action needed, at all? shouldn't everything be null safe?
export class PlayedBefore implements Action {
  readonly type = ActionTypes.PlayedBefore;
  constructor(public challenge: Challenge) {}
}
 
export class Start implements Action {
  readonly type = ActionTypes.Start;
  constructor(public gameState: GameState) {}
}
export class NextRound implements Action {
  readonly type = ActionTypes.NextRound;
}

export class EndedRound implements Action {
  readonly type = ActionTypes.EndedRound;
}

export class DecrementTimer implements Action {
  readonly type = ActionTypes.DecrementTimer;
}

export class GuessChanged implements Action {
  readonly type = ActionTypes.GuessChanged;
  constructor(public guess: google.maps.LatLng){}
}

export class GuessCalculated implements Action {
  readonly type = ActionTypes.GuessCalculated;
  constructor(public distance: number, public score: number){}
}

export class RefreshMap implements Action {
  readonly type = ActionTypes.RefreshMap;
  constructor(public duplicateGuess?: Guess) {}
}

export class ToStart implements Action {
  readonly type = ActionTypes.ToStart;
}

export class BindStatusWorker implements Action {
  readonly type = ActionTypes.BindStatusWorker;
  constructor(public statusWorker: BoundChallengeStatusService){}
}
