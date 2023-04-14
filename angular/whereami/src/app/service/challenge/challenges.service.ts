import { Injectable } from '@angular/core';
import { Challenge } from "@client/models/challenge";
import { ChallengeGeneration } from '@client/models/challenge-generation';
import { ChallengesService as ApiService, GamesService } from "@client/services";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {

  constructor(private apiClient: ApiService, private gameService: GamesService) {
  }

  getChallenges(max?: number): Observable<Challenge[]> {
    return this.apiClient.challengesList({limit: max})
    .pipe(map(paginated => paginated.results!));
  }


  public getChallenge(id: number): Observable<Challenge> {
    return this.apiClient.challengesRetrieve({id: id});
  }


  public generateChallengeFromGame(gameId: number, challenge: ChallengeGeneration): Observable<Challenge> {
    return this.gameService.gamesGenerateChallengeCreate$Json({id: gameId, body: challenge});

  }

}

