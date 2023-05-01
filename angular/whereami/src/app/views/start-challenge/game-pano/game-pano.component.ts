import {
  Component,
  ElementRef,
  Inject,
  ViewChild
} from '@angular/core';
import { ChallengeLocation } from '@client/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  filter,
  first,
  switchMap,
  withLatestFrom
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
        switchMap((worker) => worker.ghost)
      )
      .subscribe((ghost) => this.drawGhost(ghost.name, ghost.location));

    this.store
      .select(selectChallengeStatusWorker)
      .pipe(filter(Boolean), untilDestroyed(this), withLatestFrom(this.ghost()))
      .subscribe(([worker, ghost]) => worker.postGhost(ghost));
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
      this.settingsService.listen(GHOST, (enabled: boolean) => {
        if (enabled) {
          subject.next(this.pano?.getLocation()?.latLng);
        }
      });
    });
    return subject.pipe(
      filter((val) => val != undefined && val != null)
    ) as Observable<google.maps.LatLng>;
  }

  private ghostMap: Map<string, google.maps.Marker> = new Map();


  //TODO do it the rxjs way
  drawGhost(name: string, location: google.maps.LatLng) {
    this.settingsService.listen(
      GHOST,
      (enabled) => {
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
      },
      (enabled) => {
        this.ghostMap.forEach((marker) =>
          marker.setMap(enabled ? this.pano! : null)
        );
      }
    );
  }
}
