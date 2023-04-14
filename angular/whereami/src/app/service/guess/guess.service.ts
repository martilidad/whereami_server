import { Injectable } from '@angular/core';
import { Guess } from '@client/models';
import { ChallengelocationsService } from "@client/services";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GuessService {

  constructor(private challengelocationsService: ChallengelocationsService ) {
  }


  submitGuess(challengeLocationId: number, guess: Guess): Observable<Guess> {
    return this.challengelocationsService.challengelocationsGuessesCreate$Json({challengelocation_pk: challengeLocationId, body: guess});
  }

  getGuesses(id: number): Observable<Guess[]> {
    return this.challengelocationsService.challengelocationsGuessesList({challengelocation_pk: id})
    .pipe(map(paginated => paginated.results!));
  }
}
