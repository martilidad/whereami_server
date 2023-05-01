import { ChallengeLocation } from "@client/models";
import { createSelector } from "@ngrx/store";
import { GameState } from "src/app/model/status/game-state";

export const selectChallengeState = createSelector(
  (state: { challenge: GameState }) => state.challenge,
  (challenge: GameState) => challenge
);

export const selectRemainingTime = createSelector(
  selectChallengeState,
  (state: GameState) => state.round.remainingTime,
);



export const selectGuess = createSelector(
  selectChallengeState,
  (state: GameState) => state.round.guess
)

export const selectDuplicateGuessMarker = createSelector(
  selectChallengeState,
  (state: GameState) => state.round.duplicateGuessMarker
)

export const selectRound = createSelector(
  selectChallengeState,
  (state: GameState) => state.round.index
)

export const selectHumanReadableRound = createSelector(
  selectRound,
  (round: number | null) => round != null ? round + 1 : null
)

export const selectTotalRounds = createSelector(
  selectChallengeState,
  (state: GameState) => state.challenge?.locations?.length
)


export const selectChallengeId = createSelector(
  selectChallengeState,
  (state: GameState) => state.challenge?.id
)


export const selectLocation = createSelector(
  selectChallengeState,
  (state: GameState) => {
    const index = state.round.index
    if(index == null) {
      return null;
    }
    return state.challenge?.locations[index];
  }
)

export const selectLocationId = createSelector(
  selectLocation,
  (location: ChallengeLocation| null|undefined) => location?.id
)

export const selectRoundEnded = createSelector(
  selectChallengeState,
  (state: GameState) => state.round.ended
)

export const selectScore = createSelector(
  selectChallengeState,
  (state: GameState) => state.round.score
)

export const selectTotalScore = createSelector(
  selectChallengeState,
  (state: GameState) => state.score
)

export const selectDistance = createSelector(
  selectChallengeState,
  (state: GameState) => state.round.distance
)

export const selectFinished = createSelector(
  selectChallengeState,
  (state: GameState) => state.finished
)

export const selectChallengeStatusWorker = createSelector(
  selectChallengeState, 
  (state: GameState) => state.statusWorker
)