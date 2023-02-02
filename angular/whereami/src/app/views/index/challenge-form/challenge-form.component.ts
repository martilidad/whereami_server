import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GamesService} from "../../../service/game/games.service";
import {ChallengesService} from "../../../service/challenge/challenges.service";
import { Game } from '@client/models/game';

@Component({
  selector: 'challenge-form',
  templateUrl: './challenge-form.component.html',
  styleUrls: ['./challenge-form.component.css']
})
export class ChallengeFormComponent implements OnInit {

  games: Game[] = [];
  locationCount: number = 5;
  time: number = 90;
  preventReuse: boolean = true;
  private _game: Game | undefined;
  @Output()
  challengeCreated: EventEmitter<void> = new EventEmitter<void>();
  maxLocations: string = '?'

  set game(value: Game | undefined) {
    this._game = value;
    this.maxLocations = this.calcMaxLocations()
  }

  // getter is needed so the select can bind to it
  get game() {
    return this._game
  }

  constructor(private gamesService: GamesService, private challengesService: ChallengesService) {
  }

  ngOnInit(): void {
    this.gamesService.getGames()
      .subscribe(games => {
        this.games = games;
        this.game = games[0] ? games[0] : undefined
      });
  }

  submit() {
    this.challengesService.generateChallengeFromGame(this._game!.id!,
      {
      prevent_reuse: this.preventReuse,
      time: this.time,
      quantity: this.locationCount
    }).subscribe(value => this.challengeCreated.emit())
  }

  private calcMaxLocations(): string {
    return this._game ? this._game.locations.length.toString() : '?'
  }
}
