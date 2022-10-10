import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChallengeLocationImpl } from 'src/app/model/game-model/challenge-location';
import {
  boundsFromChallenge,
  RuntimeChallenge,
} from 'src/app/model/game-model/runtime-challenge';
import { PlayStatus } from 'src/app/model/status/play-status';
import { UserChallengeStatus } from 'src/app/model/status/user-challenge-status';
import {
  BoundChallengeStatusService,
  ChallengeStatusService,
} from 'src/app/service/challenge-status/challenge-status.service';
import { ChallengesService } from 'src/app/service/challenge/challenges.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css'],
})
export class InviteComponent implements AfterContentInit {
  id: number | undefined;
  statusService: BoundChallengeStatusService | undefined;
  challenge: RuntimeChallenge | undefined;
  usersHere: string[] = [];
  otherUsers: string[] = [];

  private _map: GoogleMap | undefined;

  @ViewChild('map')
  set map(value: GoogleMap) {
    this._map = value;
    this.onInputChanged();
  }

  mapOptions: google.maps.MapOptions = {
    center: new google.maps.LatLng(0, 0, true),
    zoom: 1,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  constructor(
    private challengesService: ChallengesService,
    private route: ActivatedRoute,
    private challengeStatusService: ChallengeStatusService,
    private router: Router
  ) {}

  ngAfterContentInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id']!;
      this.statusService = this.challengeStatusService.bind(this.id!);
      this.statusService.postStatus({
        status: PlayStatus.INVITE_SCREEN,
        round: -1,
      });
      this.statusService.statusObservable.subscribe((value) =>
        this.autoStartIfApplicable(value)
      );
      this.statusService.statusObservable.subscribe((value) =>
        this.filterUsers(value)
      );
      this.challengesService.getChallenge(this.id!, false).subscribe((value) => {
        this.challenge = value;
        this.onInputChanged();
      });
    });
  }

  filterUsers(statuses: Map<string, UserChallengeStatus>): void {
    this.usersHere = [];
    this.otherUsers = [];
    statuses.forEach((value: UserChallengeStatus, key: string) => {
      if (value.status == PlayStatus.INVITE_SCREEN) {
        this.usersHere.push(value.username)
      } else {
        this.otherUsers.push(value.username);
      }
    });
  }

  private autoStartIfApplicable(
    statuses: Map<string, UserChallengeStatus>
  ): void {
    if (this.autoStart) {
      statuses.forEach((value: UserChallengeStatus, key: string) => {
        if (value.round == 0 && value.status == PlayStatus.PLAYING) {
          this.router.navigate(['/startChallenge'], {
            queryParams: { id: this.id },
          });
        }
      });
    }
  }

  onInputChanged() {
    if (this._map && this.challenge) {
      let bounds: google.maps.LatLngBounds = boundsFromChallenge(
        this.challenge
      );
      this._map.fitBounds(bounds);
      let map = this._map.googleMap!;
      new google.maps.Rectangle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.1,
        map,
        bounds: bounds,
      });
    }
  }

  set autoStart(value: boolean) {
    localStorage.setItem('autostart', value.toString());
  }

  get autoStart(): boolean {
    return localStorage.getItem('autostart') == true.toString();
  }

  autoStartCheckEvent(event: Event) {
    this.autoStart = (event.target as HTMLInputElement).checked;
  }

  copyInviteLink() {
    navigator.clipboard.writeText(window.location.href);
  }
}