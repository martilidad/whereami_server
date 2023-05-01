import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Challenge } from '@client/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, switchMap, timer } from 'rxjs';
import { GOOGLE } from 'src/app/app.module';
import { GameState } from 'src/app/model/status/game-state';
import { ActionTypes, GuessChanged } from '../challenge-store/challenge.actions';
import { selectRemainingTime } from '../challenge-store/challenge.selectors';

@UntilDestroy()
@Component({
  selector: 'mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css'],
})
export class MiniMapComponent implements AfterViewInit {
  readonly DEFAULT_OPTIONS: google.maps.MapOptions;
  private readonly position;
  interacting = false
  private marker: google.maps.Marker | undefined;
  @ViewChild('map')
  map: GoogleMap | undefined;

  time$

  @ViewChild('timer')
  timer: ElementRef | undefined;

  ngAfterViewInit(): void {
    this.map!.controls[this.position].push(this.timer!.nativeElement);
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(GOOGLE) private google_ns: typeof google,
    private store: Store<{ challenge: GameState }>,
    actions$: Actions
  ) {
    this.position = google_ns.maps.ControlPosition.TOP_CENTER;
    this.DEFAULT_OPTIONS = {
      center: new google_ns.maps.LatLng(0, 0, true),
      zoom: 1,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google_ns.maps.MapTypeId.ROADMAP,
    };
    this.time$ = this.store.select(selectRemainingTime).pipe(filter(Boolean));
    actions$.pipe(ofType(ActionTypes.NextRound, ActionTypes.Start), 
    untilDestroyed(this),
    switchMap(()=>this.store.select(state => state.challenge.challenge)),
    filter(Boolean))
    .subscribe(challenge => this.reset(challenge));

    actions$.pipe(ofType(ActionTypes.EndedRound))
    .subscribe(() => this.exitFullScreen());
  }

  reset(challenge: Challenge, initial: boolean = false) {
    let bounds = new google.maps.LatLngBounds();
    challenge.game.locations
      .map((location) => new google.maps.LatLng(location.lat, location.long))
      .forEach((latLong) => bounds.extend(latLong));
    this.map!.fitBounds(bounds);
    this.marker?.setMap(null);
    this.marker = undefined;
    if (initial) {
      // this doesn't work; how to wait for map init?
      // this.map!.mapInitialized.asObservable().subscribe(() => this.map!.fitBounds(bounds));
      // this works, but is dirty
      timer(200).subscribe(() => this.map!.fitBounds(bounds));
    }
  }

  mapClick(event: google.maps.MapMouseEvent) {
    this.guessMarker().setPosition(event.latLng);
    if(event.latLng) {
      this.store.dispatch(new GuessChanged(event.latLng))
    }
  }

  private guessMarker(): google.maps.Marker {
    return (this.marker = this.marker
      ? this.marker
      : new google.maps.Marker({
          map: this.map!.googleMap,
          visible: true,
          title: 'Your guess',
          draggable: false,
          //icon: '/img/googleMapsMarkers/red_MarkerB.png'
        }));
  }

  exitFullScreen() {
    try {
      this.document
        .exitFullscreen()
        .then()
        .catch((err) => {});
    } catch (TypeError) {
      //ignore document not being active
    }
  }
}
