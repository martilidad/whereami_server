import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ChallengeLocation } from '@client/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  filter,
  first,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { GOOGLE } from 'src/app/app.module';
import { GameState } from 'src/app/model/status/game-state';
import {
  GHOST,
  SettingsService,
} from 'src/app/service/settings/settings.service';
import { Optional } from 'typescript-optional';
import {
  selectChallengeStatusWorker,
  selectLocation,
} from '../challenge-store/challenge.selectors';
import { boolean } from 'zod';

@UntilDestroy()
@Component({
  selector: 'game-pano',
  templateUrl: './game-pano.component.html',
  styleUrls: ['./game-pano.component.css'],
})
export class GamePanoComponent {
  private pano: google.maps.StreetViewPanorama | undefined;
  private startMarker: google.maps.Marker | undefined;
  startLocation$: Observable<ChallengeLocation | undefined | null>;

  constructor(
    @Inject(GOOGLE) private google_ns: typeof google,
    private settingsService: SettingsService,
    private store: Store<{ challenge: GameState }>
  ) {
    this.startLocation$ = store.select(selectLocation);
    this.startLocation$
      .pipe(untilDestroyed(this))
      .subscribe((startLocation) => {
        if (startLocation) {
          const latlng = new this.google_ns.maps.LatLng(
            startLocation.lat,
            startLocation.long
          );
          this.pano!.setPosition(latlng);
          Optional.ofNullable(this.startMarker).ifPresentOrElse(
            (marker) => marker.setPosition(latlng),
            () =>
              (this.startMarker = new this.google_ns.maps.Marker({
                clickable: false,
                position: latlng,
                map: this.pano,
                animation: this.google_ns.maps.Animation.DROP,
              }))
          );
        }
      });

    this.store
      .select(selectChallengeStatusWorker)
      .pipe(
        filter(Boolean),
        untilDestroyed(this),
        switchMap((worker) => worker.ghost),
        withLatestFrom(this.settingsService.load$(GHOST))
      )
      .subscribe(([ghost, enabled]) =>
        this.drawGhost(ghost.name, ghost.location, enabled)
      );
    this.store
      .select(selectChallengeStatusWorker)
      .pipe(
        filter(Boolean),
        untilDestroyed(this),
        withLatestFrom(this.ghost()),
        withLatestFrom(this.settingsService.load$(GHOST))
      )
      .subscribe(([[worker, ghost], enabled]) => {
        if (enabled) {
          worker.postGhost(ghost);
        }
      });
    this.settingsService
      .load$(GHOST)
      .subscribe((enabled) => this.markGhostsEnabled(enabled));
  }

  @ViewChild('panoDiv')
  set panoDiv(panoDiv: ElementRef) {
    this.pano = new this.google_ns.maps.StreetViewPanorama(
      panoDiv.nativeElement,
      {
        addressControl: false,
        linksControl: false,
        showRoadLabels: false,
        visible: true,
        fullscreenControl: false,
      }
    );
  }

  reset(): void {
    this.startLocation$
      .pipe(untilDestroyed(this))
      .pipe(first())
      .subscribe((startLocation) => {
        if (startLocation) {
          this.pano!.setPosition(
            new this.google_ns.maps.LatLng(
              startLocation.lat,
              startLocation.long
            )
          );
        }
      });
  }

  ghost(): Observable<google.maps.LatLng> {
    let subject = new Subject<google.maps.LatLng | null | undefined>();
    this.pano?.addListener('pano_changed', () => {
      subject.next(this.pano?.getLocation()?.latLng);
    });
    return subject.pipe(
      filter((val) => val != undefined && val != null)
    ) as Observable<google.maps.LatLng>;
  }

  private ghostMap: Map<string, google.maps.Marker> = new Map();

  drawGhost(name: string, location: google.maps.LatLng, enabled: boolean) {
    Optional.ofNullable(this.ghostMap.get(name)).ifPresentOrElse(
      (marker) => {
        marker.setPosition(location);
        marker.setAnimation(this.google_ns.maps.Animation.BOUNCE);
      },
      () =>
        this.ghostMap.set(
          name,
          new this.google_ns.maps.Marker({
            clickable: false,
            position: location,
            map: enabled ? this.pano : null,
            title: name,
            label: name,
            icon: '/assets/orange_marker.png',
            animation: this.google_ns.maps.Animation.BOUNCE,
          })
        )
    );
  }

  markGhostsEnabled(enabled: boolean) {
    this.ghostMap.forEach((marker) =>
      marker.setMap(enabled ? this.pano! : null)
    );
  }
}
