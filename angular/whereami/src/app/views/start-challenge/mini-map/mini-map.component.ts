import {AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";
import {RuntimeChallenge} from "../../../model/game-model/runtime-challenge";
import {DOCUMENT} from "@angular/common";
import { timer } from 'rxjs';

@Component({
  selector: 'mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit {

  private _marker: google.maps.Marker | undefined;
  @ViewChild("map")
  map: GoogleMap | undefined;

  _time: number = 0

  @ViewChild("timer")
  timer: ElementRef | undefined
  @Input()
  private position = google.maps.ControlPosition.TOP_CENTER;

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

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  reset(challenge: RuntimeChallenge, initial: boolean = false) {
    let bounds = new google.maps.LatLngBounds()
    challenge.boundary_array.map(place => new google.maps.LatLng(place.Lat, place.Long))
      .forEach(latLong => bounds.extend(latLong))
    this.map!.fitBounds(bounds)
    this._marker?.setMap(null)
    this._marker = undefined;
    if(initial) {
      // this doesn't work; how to wait for map init?
      // this.map!.mapInitialized.asObservable().subscribe(() => this.map!.fitBounds(bounds));
      // this works, but is dirty
      timer(200).subscribe(() => this.map!.fitBounds(bounds))
    }
  }

  readonly DEFAULT_OPTIONS: google.maps.MapOptions = {
    center: new google.maps.LatLng(0, 0, true),
    zoom: 1,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  mapClick(event: google.maps.MapMouseEvent) {
    this.guessMarker().setPosition(event.latLng)
  }

  private guessMarker(): google.maps.Marker {
    return this._marker = this._marker ? this._marker :new google.maps.Marker({
      map: this.map!.googleMap,
      visible: true,
      title: 'Your guess',
      draggable: false
      //icon: '/img/googleMapsMarkers/red_MarkerB.png'
    })
  }

  exitFullScreen() {
    try {
      this.document.exitFullscreen()
      .then().catch(err => {})
    } catch (TypeError) {
      //ignore document not being active
    }
  }



}
