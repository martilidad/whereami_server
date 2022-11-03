import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Game} from "../../../model/game-model/game";
import {GamesService} from "../../../service/game/games.service";
import {ChallengesService} from "../../../service/challenge/challenges.service";

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
        this._game = games[0] ? games[0] : undefined
      });
  }

  submit() {
    this.challengesService.createChallenge({
      preventReuse: this.preventReuse,
      time: this.time,
      game: this._game!.id,
      quantity: this.locationCount
    }).subscribe(value => this.challengeCreated.emit(value))
  }

  private calcMaxLocations(): string {
    return this._game?.location_count ? this._game.location_count.toString() : '?'
  }
}
