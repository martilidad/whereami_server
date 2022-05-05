import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ChallengesService} from "../challenges.service";
import {GamesService} from "../games.service";
import {Game} from "../game";
import {Challenge} from "../challenge";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [GamesService, ChallengesService]
})
export class IndexComponent implements OnInit {
  games: Game[] = [];
  challenges: Challenge[] = [];

  constructor(private challengesService: ChallengesService,
              private gamesService: GamesService) { }

  ngOnInit(): void {
    this.challengesService.getChallenges()
      .subscribe(challenges => this.challenges = challenges);
    this.gamesService.getGames()
      .subscribe(games => this.games = games);
  }

}
