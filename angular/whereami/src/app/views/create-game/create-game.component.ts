import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import type {GoogleMap} from "@angular/google-maps";
import {DrawingManagerComponent} from "./drawing-manager/drawing-manager.component";
import {HandPickedManagerComponent} from "./hand-picked/hand-picked-manager.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { GOOGLE } from 'src/app/app.module';

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

  constructor(public modalService: NgbModal, @Inject(GOOGLE) private google_ns: typeof google) {
  }

  @ViewChild('map')
  set map(map: GoogleMap) {
    if(map) {
      map.fitBounds(new this.google_ns.maps.LatLngBounds(
        new this.google_ns.maps.LatLng(70.4043, -143.5291),	//Top-left
        new this.google_ns.maps.LatLng(-46.11251, 163.4288)	 //Bottom-rigt
      ));
    }
  }


  openModal() {
    this.modalService.open(this.cancelModal)
  }

}
