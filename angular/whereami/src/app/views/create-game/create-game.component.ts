import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractGoogleMapsComponent} from "../abstract-google-maps-component";
import {HttpClient} from "@angular/common/http";
import {HttpErrorHandler} from "../../http-error-handler.service";
import {GoogleMap} from "@angular/google-maps";
import {DrawingManagerComponent} from "../../embedabble/drawing-manager/drawing-manager.component";
import {HandPickedManagerComponent} from "../../embedabble/hand-picked/hand-picked-manager.component";
import {StreetViewPlaceService} from "../../service/street-view-place/street-view-place.service";
import {CreateDrawnGame} from "./drawn-game-form/create-drawn-game";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GamesService} from "../../service/game/games.service";

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent extends AbstractGoogleMapsComponent {

  @ViewChild('handPickedManager')
  public handPickedManager!: HandPickedManagerComponent

  public handPicked: boolean = false;

  @ViewChild('drawingManager')
  public drawingManager!: DrawingManagerComponent;
  @ViewChild('cancelModal')
  public cancelModal: TemplateRef<any> | undefined;

  mapOptions = {
    center: {lat: 0, lng: 0},
    zoom: 1,
    mapTypeControl: false,
    streetViewControl: true,
    mapTypeId: 'roadmap'
  };

  constructor(httpClient: HttpClient, httpErrorHandler: HttpErrorHandler,
              public modalService: NgbModal) {
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


  openModal() {
    this.modalService.open(this.cancelModal)
  }

}
