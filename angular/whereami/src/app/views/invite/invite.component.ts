import { AfterContentInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import type { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { randomInt } from 'crypto';
import { distinct, filter, from, map, mergeMap, timer } from 'rxjs';
import { GOOGLE } from 'src/app/app.module';
import { PreviewMapComponent } from 'src/app/embedabble/preview-map/preview-map.component';
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
        .getChallengeById(this.id!)
        .subscribe((value) => {
          this.challenge = value;
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
