import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {AbstractGoogleMapsComponent} from "../abstract-google-maps-component";
import {HttpClient} from "@angular/common/http";
import {HttpErrorHandler} from "../../http-error-handler.service";
import {GoogleMap} from "@angular/google-maps";
import {DrawingManagerComponent} from "../../embedabble/drawing-manager/drawing-manager.component";
import {HandPickedComponent} from "../../embedabble/hand-picked/hand-picked.component";

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent extends AbstractGoogleMapsComponent {

  @ViewChild('handPickedManager')
  set handPickedManager(value: HandPickedComponent | undefined) {
    if(value) {
      this._handPickedManager = value;
      value.statusTextEmitter.subscribe(value => this.handPickedStatusText = value);
    }
  }

  public handPicked: boolean = false;
  public handPickedStatusText: string = "";

  @ViewChild('drawingManager')
  public drawingManager: DrawingManagerComponent | undefined;

  private _handPickedManager: HandPickedComponent | undefined;

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
    if(map) {
      map.fitBounds(new google.maps.LatLngBounds(
        new google.maps.LatLng(70.4043, -143.5291),	//Top-left
        new google.maps.LatLng(-46.11251, 163.4288)	 //Bottom-rigt
      ));
    }
  }

  public clearDrawings() {
    if(this.drawingManager) {
      this.drawingManager.clear();
    }
  }


}
