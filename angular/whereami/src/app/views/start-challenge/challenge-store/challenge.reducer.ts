import { Action } from '@ngrx/store';
import { ActionTypes, BindStatusWorker, DecrementTimer, EndedRound, GuessCalculated, GuessChanged, PlayedBefore, RefreshMap, Start } from './challenge.actions';
import { GameState, RoundState } from 'src/app/model/status/game-state';
 
 
export function challengeReducer(state: GameState=new GameState(new RoundState(null, 90), null), action: Action): GameState {
  switch (action.type) {
    case ActionTypes.PlayedBefore:
      const playedBefore = action as PlayedBefore
      return {
        ...state,
        challenge: playedBefore.challenge,
        round: new RoundState(null, state.challenge!.time)
      };
    case ActionTypes.Start:
      return (action as Start).gameState;
 
    case ActionTypes.NextRound:
      return {
        ...state,
        round: new RoundState(state.round.index! + 1, state.challenge!.time)
      };
    case ActionTypes.EndedRound:
      const finished: boolean = state.round.index != null && state.challenge != null && state.round.index + 1 >= state.challenge.locations.length
      return {
        ...state,
        score: state.score + state.round.scoreHidden,
        distance: state.distance + state.round.distanceHidden,
        finished: finished,
        round: {...state.round, 
          score: state.round.scoreHidden,
          distance: state.round.distanceHidden,
          ended: true,
          remainingTime: state.challenge!.time
        }
      };
    case ActionTypes.DecrementTimer:
      return {
        ...state,
        round: {
          ...state.round,
          remainingTime: state.round.remainingTime - 1
        }
      }
    case ActionTypes.GuessChanged:
      const guessAction = action as GuessChanged
      return {
        ...state,
        round: {
          ...state.round,
          guess: guessAction.guess
        }
      }
    case ActionTypes.GuessCalculated:
      const calcAction = action as GuessCalculated
      return {
        ...state,
        round: {
          ...state.round,
          scoreHidden: calcAction.score,
          distanceHidden: calcAction.distance
        }
      }
    case ActionTypes.RefreshMap:
      const refreshMap = action as RefreshMap
      return {
        ...state,
        round: {
          ...state.round,
          duplicateGuessMarker: refreshMap.duplicateGuess
        }
      }
    case ActionTypes.BindStatusWorker:
      const statusWorkerAction = action as BindStatusWorker
      return {
        ...state,
        statusWorker: statusWorkerAction.statusWorker
      }
    default:
      return state;
  }
}