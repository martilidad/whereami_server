import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {AbstractGoogleMapsComponent} from "../abstract-google-maps-component";
import {HttpClient} from "@angular/common/http";
import {HttpErrorHandler} from "../../http-error-handler.service";
import {GoogleMap} from "@angular/google-maps";

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent extends AbstractGoogleMapsComponent {

  mapOptions = {
    center: {lat: 0, lng: 0},
    zoom: 1,
    mapTypeControl: false,
    streetViewControl: true,
    mapTypeId: 'roadmap'
  };

  constructor(httpClient: HttpClient, httpErrorHandler: HttpErrorHandler) {
    super(httpClient, httpErrorHandler.createHandleError('CreateGameComponent'));
  }

  @ViewChild('map')
  set map(map: GoogleMap) {
    map.fitBounds(new google.maps.LatLngBounds(
      new google.maps.LatLng(70.4043, -143.5291),	//Top-left
      new google.maps.LatLng(-46.11251, 163.4288)	 //Bottom-rigt
    ));
  }

}
