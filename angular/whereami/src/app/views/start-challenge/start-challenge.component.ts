import {AfterContentInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {
  BoundChallengeStatusService,
  ChallengeStatusService
} from "../../service/challenge-status/challenge-status.service";
import {ChallengesService} from "../../service/challenge/challenges.service";
import {RuntimeChallenge} from "../../model/game-model/runtime-challenge";
import {MiniMapComponent} from "./mini-map/mini-map.component";
import {GameState, RoundState} from "../../model/status/game-state";
import {PlayStatus} from "../../model/status/play-status";
import {GamePanoComponent} from "../../embedabble/game-pano/game-pano.component";
import {GuessService} from "../../service/guess/guess.service";
import {ChallengeLocationImpl} from "../../model/game-model/challenge-location";
import {LatLngImpl} from "../../model/lat-lng";
import {RoundMapComponent} from "../../embedabble/round-map/round-map.component";
import {Subscription} from "rxjs";
import { UserChallengeStatus } from 'src/app/model/status/user-challenge-status';
import { CheckboxControlValueAccessor } from '@angular/forms';


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

  @ViewChild("gamePano")
  gamePano: GamePanoComponent | undefined

  time: number = 0;


  challenge: RuntimeChallenge | undefined;
  public gameState: GameState = new GameState(new RoundState(0, this.DEFAULT_TIME))

  constructor(private route: ActivatedRoute,
              private challengeStatusService: ChallengeStatusService, private challengesService: ChallengesService,
              private guessService: GuessService) {
  }

  ngAfterContentInit(): void {
    this.subscriptions.push(this.route.queryParams.subscribe(params => {
      this.id = params['id']!
      this.ignorePreviousGuesses = params['ignorePreviousGuesses'] ? params['ignorePreviousGuesses'] : false
      this.statusService = this.challengeStatusService.bind(this.id!)
      this.subscriptions.push(this.challengesService.getChallenge(this.id!, this.ignorePreviousGuesses!)
        .subscribe(value => this.start(value)))
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
    this.gameState.round.remainingTime = 0
    this.gameState.finished = this.gameState.round.index + 1 == this.challenge!.Challenge_Locations.length
    let pos = this.miniMap!.marker?.getPosition()
    //only assign if there is a position
    this.gameState.round.guess = pos ? LatLngImpl.of(pos) : new LatLngImpl(0, 0)

    this.calcPoints()

    let challengeLocation = this.challenge!.Challenge_Locations[this.gameState.round.index];
    let round = this.gameState.round;
    let guess = {
      Lat: this.gameState.round.guess.Lat, 
      Long: this.gameState.round.guess.Long,
      Challenge_Location_ID: challengeLocation.Challenge_Location_ID, 
      Distance: round.distance, 
      Score: round.score,
      Username: "You(Not on Server)",
      Pub_Date: undefined
    };
    this.guessService.submitGuess(guess)
    this.statusService!.postStatus({status: PlayStatus.ROUND_END, round: this.serverRound()})
    this.statusService?.statusObservable.subscribe(value => this.autoStartIfApplicable(value))
    this.roundMap!.guesses = [guess];
    this.roundMap!.location = challengeLocation
    this.refreshMap()
  }

  refreshMap() {
    this.guessService.getGuesses(this.challenge!.Challenge_Locations[this.gameState.round.index].Challenge_Location_ID)
      .subscribe(result => this.roundMap!.guesses = result)
  }

  private autoStartIfApplicable(statuses: Map<string, UserChallengeStatus>) {
    if(this.autoStart) {
      statuses.forEach((value:UserChallengeStatus, key: string) => {
          if(value.round == this.serverRound() + 1 && value.status == PlayStatus.PLAYING) {
            this.nextRound();
          }
      })
    }
  }

  private start(challenge: RuntimeChallenge) {
    this.challenge = challenge

    if (this.challenge.Challenge_Locations.length === 0) {
      this.gameState.playedBefore = true
      return;
    }
    this.gameState = new GameState(new RoundState(0, challenge.Time))

    //Challenge_Locations only contains the locations *THIS PLAYER* didn't play
    this.statusService!.postStatus({status: PlayStatus.PLAYING, round: this.serverRound()})
    let challengeLocation = new ChallengeLocationImpl(challenge.Challenge_Locations[0])
    this.gamePano!.setLocation(challengeLocation.toLatLng())

    // Scoreboard & Guess button event
    // Init Timer
    this.resetTimer();
    this.miniMap!.reset(challenge, true)
  }

  public humanReadableRound(serverRound: number | null = null) {
    return (serverRound ? serverRound : this.serverRound()) + 1
  }

  public serverRound() {
    return this.gameState.round.index + this.challenge!.Ignored_Count
  }

  nextRound() {
    this.statusSubscription?.unsubscribe()
    let round = this.gameState.round.index + 1;
    this.gameState.round = new RoundState(round, this.challenge!.Time)
    this.statusService!.postStatus({status: PlayStatus.PLAYING, round: round})
    this.resetTimer()
    this.challenge ? this.miniMap?.reset(this.challenge) : {};
    let challengeLocation = new ChallengeLocationImpl(this.challenge!.Challenge_Locations[round])
    this.gamePano!.setLocation(challengeLocation.toLatLng())
  }

  resetTimer() {
    this.gameState.round.remainingTime = this.challenge!.Time
    this.counter = setInterval(() => this.timer(), 1000)
  }


  timer() {
    this.gameState.round.remainingTime = this.gameState.round.remainingTime - 1;
    if (this.gameState.round.remainingTime <= 0) {
      console.log('finished');
      this.miniMap!.exitFullScreen()
      this.endRound()
      clearInterval(this.counter);
    }
  }

  private static calcDistance(from: google.maps.LatLng, to: google.maps.LatLng): number {
    return google.maps.geometry.spherical.computeDistanceBetween(from, to);
  }


  private calcPoints(): void {
    // Calculate distance between points, and convert to kilometers
    let location = new ChallengeLocationImpl(this.challenge!.Challenge_Locations[this.gameState.round.index])
    let distance = Math.floor(StartChallengeComponent.calcDistance(this.gameState.round.guess!.toLatLng(), location.toLatLng()!) / 10) / 100;

    // use exponential function for points calculation.
    let score = Math.floor(this.MAX_POINT_DISTANCE ** (1 - distance / this.LAST_POINT_DISTANCE));
    this.gameState.updateScore(distance, score)
  }

  set autoStart(value: boolean) {
    localStorage.setItem("autostart", value.toString());
  }

  get autoStart(): boolean {
    return localStorage.getItem("autostart") == true.toString();
  }

  autoStartCheckEvent(event: Event) {
    this.autoStart = (event.target as HTMLInputElement).checked
  }
}
