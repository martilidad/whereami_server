import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {HandPickedManagerComponent} from "../hand-picked/hand-picked-manager.component";
import {DrawingManagerComponent} from "../drawing-manager/drawing-manager.component";
import {CreateHandpickedGame} from "./create-handpicked-game";
import {GamesService} from "../../../service/game/games.service";
import {StreetViewPlace} from "../../../service/street-view-place/streetViewPlace";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'handpicked-game-form',
  templateUrl: './handpicked-game-form.component.html',
  styleUrls: ['./handpicked-game-form.component.css']
})
export class HandpickedGameFormComponent implements OnInit {

  @Output()
  cancelled = new EventEmitter<any>();
  
  @Input()
  public handPickedManager: HandPickedManagerComponent | undefined

  @ViewChild('importFileTooltip')
  public importFileTooltip: TemplateRef<any> | undefined;
  
  public statusText: string = ""

  public model = new CreateHandpickedGame("")

  public fileFormat = `{
    "map_name": "some-map",
    "locations": [
      {
        "latLng": {"lat": 38.888222, "lng": -77.03719699999999},
        "name": "some location"
      },
      {
        "latLng": {"lat": 40.947916, "lng": -4.11834599999997},
        "name": "some other location"
      },
      ...
    ]
  }`;

  selectedFile = '';


  constructor(public modalService: NgbModal, private gamesService: GamesService) { }

  ngOnInit(): void {
  }


  submit() {
    let streetViewPlaces = this.handPickedManager!.markers.map(marker => new StreetViewPlace(marker.getPosition()!.lat(), marker.getPosition()!.lng(), marker.getTitle()!));
    this.gamesService.createGame({Name: this.model.name, Locations: streetViewPlaces})
      .subscribe({
        next: value => this.statusText = "Success",
        error: value => this.statusText = value.error
      });
  }

  public cancel() {
    this.cancelled.emit();
  }

  openModal() {
    this.modalService.open(this.importFileTooltip);
  }

  handleImportFile(e: any) {
    this.statusText = "";
    const file: File = e.target.files[0];
    if (file) {
      this.selectedFile = file.name;
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt: ProgressEvent<FileReader>) => {
        try {
          var fileContent = evt.target!.result;
          var obj = JSON.parse(fileContent!.toString());
          if (this.model.name.trim() == "") {
            this.model.name = obj.map_name;
          }
          var locations = obj.locations;
          for (var locId in locations) {
            var location = locations[locId];
            if (location.hasOwnProperty('name') && location.name.trim() != "") {
              this.handPickedManager!.addMarker(location.latLng, location.name);
            } else {
              const importRadius = 50; // for imports there should be a street view panorama in close distance
              this.handPickedManager!.addMarkerFromPanorama(location.latLng, importRadius); // retrieve a panorama for the location to get a name
            }
          }
        } catch (e) {
          this.statusText = "Error reading file: json syntax invalid";
          console.log(e);
        }
      };
    } else {
      this.statusText = "no file selected"
    }
  }
}
