import {Component, Input, ViewChild} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";
import { ChallengeLocation, ChallengeLocationImpl } from 'src/app/model/game-model/challenge-location';
import { Guess } from 'src/app/model/game-model/guess';
import { UserService } from 'src/app/service/user/user.service';

const ACTUAL_MARKER_URL = "/assets/red_marker.png";
const PLAYER_MARKER_URL = "/assets/green_marker.png";
const ENEMY_MARKER_URL = "/assets/orange_marker.png";

@Component({
  selector: 'round-map',
  templateUrl: './round-map.component.html',
  styleUrls: ['./round-map.component.css']
})
export class RoundMapComponent {


  @Input()
  classAppend: string = "";
  // Initializes the google Map
  @Input()
  enabled: boolean = false
  private roundBounds = new google.maps.LatLngBounds();
  private _guesses: Guess[] = []
  private _location: ChallengeLocation | undefined

  constructor(private userService: UserService) {}

  mapOptions: google.maps.MapOptions = {
    center: new google.maps.LatLng(0, 0, true),
    zoom: 1,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  private _map: GoogleMap | undefined;
  private markers: google.maps.Marker[] = []

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
    this.roundBounds = new google.maps.LatLngBounds();
    this.drawChallengeLocation(this._location)
    this._guesses.forEach(element => {
      this.drawGuess(element)
    });
    this._map.fitBounds(this.roundBounds)
  }

  private drawChallengeLocation(location: ChallengeLocation) {
    var latLng = new ChallengeLocationImpl(location).toLatLng();
    this.drawMarker(new google.maps.Marker({
      position: latLng,
      label: "Actual Location",
      icon: ACTUAL_MARKER_URL
    }));
  }

  private drawGuess(guess: Guess) {
    var marker = guess.Username == this.userService.username ? this.playerMarker(guess, guess.Pub_Date != null) : this.enemyMarker(guess);
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
    return new google.maps.Marker({
      position: new google.maps.LatLng(guess.Lat, guess.Long),
      label: guess.Username,
      icon: ENEMY_MARKER_URL,
      title: 'Distance: ' + guess.Distance + ' Score: ' + guess.Score
    });
  }

  private playerMarker(guess: Guess, synched=true): google.maps.Marker {
    return new google.maps.Marker({
      position: new google.maps.LatLng(guess.Lat, guess.Long),
      label: synched ? "You" : "You (not on Server)",
      icon: PLAYER_MARKER_URL,
      title: 'Distance: ' + guess.Distance + ' Score: ' + guess.Score
    });
  }

}
