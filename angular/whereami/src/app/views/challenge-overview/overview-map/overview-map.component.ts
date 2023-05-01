import {Component, Inject, InjectionToken, Input, ViewChild} from '@angular/core';
import { GOOGLE } from '../../../app.module';
import { ChallengeLocation, Location, Guess } from '@client/models';
import { UserService } from '../../../service/user/user.service';
// Only import for type hints; the runtime dependency is injected!!!
import type {GoogleMap} from "@angular/google-maps";

const ACTUAL_MARKER_URL = "/assets/red_marker.png";
const PLAYER_MARKER_URL = "/assets/green_marker.png";
const ENEMY_MARKER_URL = "/assets/orange_marker.png";

//TODO simplify after splitting the shared roundmap
@Component({
  selector: 'overview-map',
  templateUrl: './overview-map.component.html',
  styleUrls: ['./overview-map.component.css']
})
export class OverviewMapComponent {


  @Input()
  classAppend: string = "";
  // Initializes the google Map
  @Input()
  enabled: boolean = false
  private roundBounds: google.maps.LatLngBounds;
  private _guesses: Guess[] = []
  private _location: ChallengeLocation | undefined

  constructor(private userService: UserService, @Inject(GOOGLE) private google_ns: typeof google) {
    this.mapOptions = {
      center: new google_ns.maps.LatLng(0, 0, true),
      zoom: 1,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google_ns.maps.MapTypeId.ROADMAP
    }
    this.roundBounds = new google_ns.maps.LatLngBounds();
    this.markers = [];
  }

  mapOptions: google.maps.MapOptions;

  private _map: GoogleMap | undefined;
  private markers: google.maps.Marker[];

  @ViewChild("map")
  set map(value: GoogleMap) {
    this._map = value;
    this.onInputChanged();
  }

  @Input()
  set guesses(value: Guess[]) {
    this._guesses = value;
    this.onInputChanged();
  }

  @Input()
  set location(value: ChallengeLocation) {
    this._location = value;
    this.onInputChanged();
  }

  private onInputChanged() {
    if(!this._map || !this._location) {
      return;
    }
    this.markers.forEach(m => m.setMap(null));
    this.roundBounds = new this.google_ns.maps.LatLngBounds();
    this.drawChallengeLocation(this._location)
    this._guesses.forEach(element => {
      this.drawGuess(element)
    });
    this._map.fitBounds(this.roundBounds)
  }

  private drawChallengeLocation(location: ChallengeLocation | Location) {
    var latLng = new this.google_ns.maps.LatLng(location.lat, location.long);
    this.drawMarker(new this.google_ns.maps.Marker({
      position: latLng,
      label: "Target",
      icon: ACTUAL_MARKER_URL
    }));
  }

  private drawGuess(guess: Guess) {
    var marker = guess.username == this.userService.username ? this.playerMarker(guess, guess.pub_date != null) : this.enemyMarker(guess);
    this.drawMarker(marker);
  }

  private drawMarker(marker: google.maps.Marker) {
    if(this._map && this._map.googleMap) {
      marker.setMap(this._map.googleMap);
      this.markers.push(marker);
    }
    let pos = marker.getPosition()
    if(pos) {
      this.roundBounds.extend(pos)
    }
  }

  private enemyMarker(guess: Guess): google.maps.Marker {
    return new this.google_ns.maps.Marker({
      position: new this.google_ns.maps.LatLng(guess.lat, guess.long),
      label: guess.username,
      icon: ENEMY_MARKER_URL,
      title: 'Distance: ' + guess.distance + ' Score: ' + guess.score
    });
  }

  private playerMarker(guess: Guess, synched=true): google.maps.Marker {
    return new this.google_ns.maps.Marker({
      position: new this.google_ns.maps.LatLng(guess.lat, guess.long),
      label: synched ? "You" : "You (not on Server)",
      icon: PLAYER_MARKER_URL,
      title: 'Distance: ' + guess.distance + ' Score: ' + guess.score
    });
  }

}
