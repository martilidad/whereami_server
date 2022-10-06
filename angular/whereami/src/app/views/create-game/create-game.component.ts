import {Component, TemplateRef, ViewChild} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";
import {DrawingManagerComponent} from "./drawing-manager/drawing-manager.component";
import {HandPickedManagerComponent} from "./hand-picked/hand-picked-manager.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent {

  @ViewChild('handPickedManager')
  public handPickedManager: HandPickedManagerComponent | undefined

  public handPicked: boolean = false;

  @ViewChild('drawingManager')
  public drawingManager: DrawingManagerComponent | undefined;
  @ViewChild('cancelModal')
  public cancelModal: TemplateRef<any> | undefined;

  mapOptions = {
    center: {lat: 0, lng: 0},
    zoom: 1,
    mapTypeControl: false,
    streetViewControl: true,
    mapTypeId: 'roadmap'
  };

  constructor(public modalService: NgbModal) {
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
