import { AfterContentInit, Component, HostListener, Inject, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Challenge } from '@client/models';
import { Subject, Subscription, distinct, filter, from, mergeMap } from "rxjs";
import { GOOGLE } from 'src/app/app.module';
import { UserChallengeStatus } from 'src/app/model/status/user-challenge-status';
import { AUTOSTART, SettingsService } from 'src/app/service/settings/settings.service';
import { SoundService } from 'src/app/service/sound/sound.service';
import { UserService } from 'src/app/service/user/user.service';
import { GamePanoComponent } from "../../embedabble/game-pano/game-pano.component";
import { RoundMapComponent } from "../../embedabble/round-map/round-map.component";
import { LatLngImpl } from "../../model/lat-lng";
import { GameState, RoundState } from "../../model/status/game-state";
import { PlayStatus } from "../../model/status/play-status";
import {
  BoundChallengeStatusService,
  ChallengeStatusService
} from "../../service/challenge-status/challenge-status.service";
import { ChallengesService } from "../../service/challenge/challenges.service";
import { GuessService } from "../../service/guess/guess.service";
import { MiniMapComponent } from "./mini-map/mini-map.component";


@Component({
  selector: 'app-start-challenge',
  templateUrl: './start-challenge.component.html',
  styleUrls: ['./start-challenge.component.css']
  //TODO add endgame fadein animation
})
export class StartChallengeComponent implements AfterContentInit, OnDestroy {

  private subscriptions: Subscription[] = []
  private statusSubscription: Subscription | undefined;

  private readonly DEFAULT_TIME = 90;
  private readonly MAX_POINT_DISTANCE = 10000;
  /**
   * Min distance for at least one point.
   */
  private readonly LAST_POINT_DISTANCE = 14000;

  private counter: NodeJS.Timer | undefined

  @HostListener('window:beforeunload')
  confirmLeave(event: BeforeUnloadEvent) {
    event.preventDefault()
    event.returnValue = 'Are you sure you want to leave?'
  }

  id: number | undefined
  ignorePreviousGuesses: boolean | undefined
  statusService: BoundChallengeStatusService | undefined

  @ViewChild("miniMap")
  miniMap: MiniMapComponent | undefined

  @ViewChild("roundMap")
  roundMap: RoundMapComponent | undefined

  private _gamePano: GamePanoComponent | undefined;

  @ViewChild("gamePano")
  public set gamePano(value: GamePanoComponent) {
    this._gamePano = value;
    value.ghost().subscribe(val => this.statusService?.postGhost(val));
  }

  time: number = 0;


  challenge: Challenge | undefined;
  public gameState: GameState = new GameState(new RoundState(0, this.DEFAULT_TIME))

  constructor(private route: ActivatedRoute,
              private challengeStatusService: ChallengeStatusService, private challengesService: ChallengesService,
              private guessService: GuessService,
              @Inject(GOOGLE) private google_ns: typeof google,
              private soundService: SoundService,
              private userService: UserService,
              private settingsService: SettingsService) {
  }

  ngAfterContentInit(): void {
    this.subscriptions.push(this.route.queryParams.subscribe(params => {
      this.id = params['id']!
      this.ignorePreviousGuesses = params['ignorePreviousGuesses'] ? params['ignorePreviousGuesses'] : false
      this.statusService = this.challengeStatusService.bind(this.id!);
      this.statusService.statusObservable.pipe(mergeMap(val => from(val.values())))
      .pipe(filter(val => val.round === this.gameState.round.index && val.status === PlayStatus.ROUND_END && val.username != this.userService.username))
      .pipe(distinct(val => {return {user: val.username, round: val.round}}))
      .subscribe(() => this.soundService.complete());
      this.subscriptions.push(this.challengesService.getChallenge(this.id!)
        .subscribe(value => this.start(value, this.ignorePreviousGuesses!)))
      this.statusService.ghost.subscribe(val => this._gamePano?.drawGhost(val.name, val.location));
    }))
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(value => value.unsubscribe())
  }

  /**
   * Endround callback
   * Either triggered by user click or by timer.
   */
  endRound() {
    clearInterval(this.counter);
    this.timerEndObservable.next({});
    this.gameState.round.remainingTime = 0
    this.gameState.finished = this.gameState.round.index + 1 == this.challenge!.locations.length
    let pos = this.miniMap!.marker?.getPosition()
    //only assign if there is a position
    this.gameState.round.guess = pos ? LatLngImpl.of(pos) : new LatLngImpl(0, 0)

    this.calcPoints()

    let challengeLocation = this.challenge!.locations[this.gameState.round.index];
    let round = this.gameState.round;
    let guess = {
      id: null,
      pub_date: null,
      lat: this.gameState.round.guess.Lat, 
      long: this.gameState.round.guess.Long,
      distance: round.distance, 
      score: round.score,
      username: "You(Not on Server)"
    };
    this.guessService.submitGuess(challengeLocation.id!, guess).subscribe(() => this.refreshMap());
    this.statusService!.postStatus({status: PlayStatus.ROUND_END, round: this.gameState.round.index})
    this.statusService?.statusObservable.subscribe(value => this.autoStartIfApplicable(value))
    this.roundMap!.guesses = [guess];
    this.roundMap!.location = challengeLocation
    this.refreshMap()
  }

  refreshMap() {
    this.guessService.getGuesses(this.challenge!.locations[this.gameState.round.index].id!)
      .subscribe(result => this.roundMap!.guesses = result)
  }

  private autoStartIfApplicable(statuses: Map<string, UserChallengeStatus>) {
    if(this.autoStart) {
      statuses.forEach((value:UserChallengeStatus, key: string) => {
          if(value.round == this.gameState.round.index + 1 && value.status == PlayStatus.PLAYING) {
            this.nextRound();
          }
      })
    }
  }

  private start(challenge: Challenge, ignorePreviousGuesses: boolean) {
    this.challenge = challenge
    let firstUnplayed = ignorePreviousGuesses ? 0 : this.challenge.locations.findIndex(location => !location.guessed);
    if (firstUnplayed === -1) {
      this.gameState.playedBefore = true
      return;
    }
    this.soundService.start();
    this.gameState = new GameState(new RoundState(0, challenge.time))

    this.statusService!.postStatus({status: PlayStatus.PLAYING, round: this.gameState.round.index})
    let challengeLocation = challenge.locations[firstUnplayed];
    this._gamePano!.setLocation(new this.google_ns.maps.LatLng(challengeLocation.lat, challengeLocation.long));

    // Scoreboard & Guess button event
    // Init Timer
    this.resetTimer();
    this.miniMap!.reset(challenge, true)
  }

  public humanReadableRound() {
    return this.gameState.round.index + 1;
  }

  nextRound() {
    this.soundService.start();
    this.statusSubscription?.unsubscribe();
    let round = this.gameState.round.index + 1;
    this.gameState.round = new RoundState(round, this.challenge!.time)
    this.statusService!.postStatus({status: PlayStatus.PLAYING, round: round})
    this.resetTimer()
    this.challenge ? this.miniMap?.reset(this.challenge) : {};
    let challengeLocation = this.challenge!.locations[round]
    this._gamePano!.setLocation(new this.google_ns.maps.LatLng(challengeLocation.lat, challengeLocation.long))
  }

  resetTimer() {
    this.gameState.round.remainingTime = this.challenge!.time
    this.counter = setInterval(() => this.timer(), 1000)
  }


  private timerEndObservable = new Subject();
  timer() {
    this.gameState.round.remainingTime = this.gameState.round.remainingTime - 1;
    if(this.gameState.round.remainingTime === 10) {
      this.soundService.tenSeconds(this.timerEndObservable);
    }
    if (this.gameState.round.remainingTime <= 0) {
      console.log('finished');
      this.miniMap!.exitFullScreen();
      this.endRound();
      clearInterval(this.counter);
    }
  }

  private calcDistance(from: google.maps.LatLng, to: google.maps.LatLng): number {
    return this.google_ns.maps.geometry.spherical.computeDistanceBetween(from, to);
  }


  private calcPoints(): void {
    // Calculate distance between points, and convert to kilometers
    let location = this.challenge!.locations[this.gameState.round.index]
    let distance = Math.floor(this.calcDistance(this.gameState.round.guess!.toLatLng(this.google_ns), new this.google_ns.maps.LatLng(location.lat, location.long)) / 10) / 100;

    // use exponential function for points calculation.
    let score = Math.floor(this.MAX_POINT_DISTANCE ** (1 - distance / this.LAST_POINT_DISTANCE));
    this.gameState.updateScore(distance, score)
    this.soundService.score(score, this.MAX_POINT_DISTANCE)
  }

  set autoStart(value: boolean) {
    this.settingsService.save(value, AUTOSTART);
  }

  get autoStart(): boolean {
    return this.settingsService.load(AUTOSTART);
  }

  autoStartCheckEvent(event: Event) {
    this.autoStart = (event.target as HTMLInputElement).checked
  }
}
