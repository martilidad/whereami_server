import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  ViewChild,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { DOCUMENT } from '@angular/common';
import { timer } from 'rxjs';
import { GOOGLE } from 'src/app/app.module';
import { SoundService } from 'src/app/service/sound/sound.service';
import { Challenge } from '@client/models';

@Component({
  selector: 'mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css'],
})
export class MiniMapComponent implements AfterViewInit {
  private _marker: google.maps.Marker | undefined;
  @ViewChild('map')
  map: GoogleMap | undefined;

  _time: number = 0;

  @ViewChild('timer')
  timer: ElementRef | undefined;
  @Input()
  private position;

  @Input()
  public set time(value: number) {
    this._time = value;
  }

  get marker(): google.maps.Marker | undefined {
    return this._marker;
  }

  ngAfterViewInit(): void {
    this.map!.controls[this.position].push(this.timer!.nativeElement);
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(GOOGLE) private google_ns: typeof google,
    private soundService: SoundService
  ) {
    this.position = google_ns.maps.ControlPosition.TOP_CENTER;
    this.DEFAULT_OPTIONS = {
      center: new google_ns.maps.LatLng(0, 0, true),
      zoom: 1,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google_ns.maps.MapTypeId.ROADMAP,
    };  
  }

  reset(challenge: Challenge, initial: boolean = false) {
    let bounds = new google.maps.LatLngBounds();
    challenge.game.locations
      .map((location) => new google.maps.LatLng(location.lat, location.long))
      .forEach((latLong) => bounds.extend(latLong));
    this.map!.fitBounds(bounds);
    this._marker?.setMap(null);
    this._marker = undefined;
    if (initial) {
      // this doesn't work; how to wait for map init?
      // this.map!.mapInitialized.asObservable().subscribe(() => this.map!.fitBounds(bounds));
      // this works, but is dirty
      timer(200).subscribe(() => this.map!.fitBounds(bounds));
    }
  }

  readonly DEFAULT_OPTIONS: google.maps.MapOptions;
  mapClick(event: google.maps.MapMouseEvent) {
    this.guessMarker().setPosition(event.latLng);
    this.soundService.pin();
  }

  private guessMarker(): google.maps.Marker {
    return (this._marker = this._marker
      ? this._marker
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
