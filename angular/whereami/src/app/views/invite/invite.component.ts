import { AfterContentInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import type { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { randomInt } from 'crypto';
import { distinct, filter, from, map, mergeMap, timer } from 'rxjs';
import { GOOGLE } from 'src/app/app.module';
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
import { AUTOSTART, SettingsService } from 'src/app/service/settings/settings.service';
import { SoundService } from 'src/app/service/sound/sound.service';
import { UserService } from 'src/app/service/user/user.service';
import { distinctTimes } from 'src/app/service/utils';

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

  mapOptions: google.maps.MapOptions;

  constructor(
    private challengesService: ChallengesService,
    private route: ActivatedRoute,
    private challengeStatusService: ChallengeStatusService,
    private router: Router,
    @Inject(GOOGLE) private google_ns: typeof google,
    private soundService: SoundService,
    private userService: UserService,
    private settingsService: SettingsService
  ) {
    this.mapOptions = {
      center: new google_ns.maps.LatLng(0, 0, true),
      zoom: 1,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google_ns.maps.MapTypeId.ROADMAP,
    };
  }

  ngAfterContentInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id']!;
      this.statusService = this.challengeStatusService.bind(this.id!);
      this.statusService.postStatus({
        status: PlayStatus.INVITE_SCREEN,
        round: -1,
      });
      this.statusService.statusObservable
        .pipe(mergeMap((val) => from(val.values())))
        .pipe(
          filter(
            (val) =>
              val.status === PlayStatus.INVITE_SCREEN &&
              val.username != this.userService.username
          )
        )
        //only allow one sound within 500ms
        .pipe(distinct(() => ({}), timer(0, 500)))
        //one user can only create three sounds and at least five seconds apart to prevent spam
        .pipe(distinct((val) => val.username, timer(0, 5000)))
        .pipe(distinctTimes((val) => val.username, 3))
        .subscribe(() => this.soundService.arrive());
      this.statusService.statusObservable.subscribe((value) =>
        this.autoStartIfApplicable(value)
      );
      this.statusService.statusObservable.subscribe((value) =>
        this.filterUsers(value)
      );
      this.challengesService
        .getChallenge(this.id!, false)
        .subscribe((value) => {
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
        this.usersHere.push(value.username);
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

  private outline: {setMap: (aMap: google.maps.Map | null) => void} | undefined;

  onInputChanged() {
    if (this._map && this.challenge) {
      let bounds: google.maps.LatLngBounds = boundsFromChallenge(
        this.challenge,
        this.google_ns
      );
      this._map.fitBounds(bounds);
      let map = this._map.googleMap!;
      this.outline?.setMap(null);
      if (this.challenge.all_locations.length < 10) {
        this.outline = new this.google_ns.maps.Rectangle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.1,
          map,
          bounds: bounds,
        });
      } else {
        const diagonal = this.google_ns.maps.geometry.spherical.computeDistanceBetween(
          bounds.getNorthEast(),
          bounds.getSouthWest()
        );
        const maxLat = Math.abs(
          bounds.getNorthEast().lat() - bounds.getSouthWest().lat()
        );
        const maxLng = Math.abs(
          bounds.getNorthEast().lng() - bounds.getSouthWest().lng()
        );
        let circles = this.challenge.all_locations.map((location) => {
          let circle = this.drawCircle(
            {
              lat: location.Lat + this.randomOffset(maxLat),
              lng: location.Long + this.randomOffset(maxLng),
            },
            diagonal / 6000
          ); // + this.randomOffset(maxLng)
          return circle;
        });
        this.outline = new this.google_ns.maps.Polygon({
          paths: circles,
          map: map,
          strokeOpacity: 0,
        });
      }
    }
  }

  /**
   * shamelessly copied from https://stackoverflow.com/questions/23154254/google-map-multiple-overlay-no-cumulative-opacity
   * @radius in km
   */
  private drawCircle(point: google.maps.LatLngLiteral, radius: number) {
    var d2r = Math.PI / 180; // degrees to radians
    var r2d = 180 / Math.PI; // radians to degrees
    var earthsradius = 6378; // 6378 is the radius of the earth in km
    var points = 32;

    // find the raidus in lat/lon
    var rlat = (radius / earthsradius) * r2d;
    var rlng = rlat / Math.cos(point.lat * d2r);

    var extp = new Array();
    for (var i = 0; i <= points; i = i + 1) {
      var theta = Math.PI * (i / (points / 2));
      let ey = point.lng + rlng * Math.cos(theta); // center a + radius x * cos(theta)
      let ex = point.lat + rlat * Math.sin(theta); // center b + radius y * sin(theta)
      extp.push(new this.google_ns.maps.LatLng(ex, ey));
    }
    return extp;
  }

  /**
   * 
   * @param diagonal aprox max distance of map, diagonally
   * @returns 
   */
  private randomOffset(diagonal: number): number {
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    return Math.random() * (diagonal / 5) * plusOrMinus;
  }

  set autoStart(value: boolean) {
    this.settingsService.save(value, AUTOSTART);
  }

  get autoStart(): boolean {
    return this.settingsService.load(AUTOSTART);
  }

  autoStartCheckEvent(event: Event) {
    this.autoStart = (event.target as HTMLInputElement).checked;
  }

  copyInviteLink() {
    navigator.clipboard.writeText(window.location.href);
  }
}
