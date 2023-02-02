import { Injectable } from '@angular/core';
import { Guess } from '@client/models';
import { ApiService } from "@client/services";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GuessService {

  constructor(private apiService: ApiService) {
  }


  submitGuess(challengeLocationId: number, guess: Guess): Observable<Guess> {
    return this.apiService.apiChallengelocationsGuessesCreate$Json({challengelocation_pk: challengeLocationId, body: guess});
  }

  getGuesses(id: number): Observable<Guess[]> {
    return this.apiService.apiChallengelocationsGuessesList({challengelocation_pk: id})
    .pipe(map(paginated => paginated.results!));
  }
}
