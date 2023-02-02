import { Injectable } from '@angular/core';
import { Challenge } from "@client/models/challenge";
import { ChallengeGeneration } from '@client/models/challenge-generation';
import { ApiService } from "@client/services/api.service";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {

  constructor(private apiClient: ApiService) {
  }

  getChallenges(max?: number): Observable<Challenge[]> {
    return this.apiClient.apiChallengesList({limit: max})
    .pipe(map(paginated => paginated.results!));
  }


  public getChallenge(id: number): Observable<Challenge> {
    return this.apiClient.apiChallengesRetrieve({id: id});
  }


  public generateChallengeFromGame(gameId: number, challenge: ChallengeGeneration): Observable<Challenge> {
    return this.apiClient.apiGamesGenerateChallengeCreate$Json({id: gameId, body: challenge});

  }

}

