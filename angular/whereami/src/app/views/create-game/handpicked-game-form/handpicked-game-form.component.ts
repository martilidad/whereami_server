import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {HandPickedManagerComponent} from "../hand-picked/hand-picked-manager.component";
import {CreateHandpickedGame} from "./create-handpicked-game";
import {GamesService} from "../../../service/game/games.service";
import {FileService} from "../../../service/file/file.service";
import {StreetViewPlace} from "../../../service/street-view-place/streetViewPlace";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportLocations } from 'src/app/model/import-locations';

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


  constructor(public modalService: NgbModal, private gamesService: GamesService, private fileService: FileService) { }

  ngOnInit(): void {
  }


  submit() {
    let streetViewPlaces = this.handPickedManager!.markers.map(marker => 
      ({id: null, 
        pub_date: null, 
        lat: marker.getPosition()!.lat(), 
        long: marker.getPosition()!.lng(), 
        name: marker.getTitle()!}));
    this.gamesService.createGame({id: null, name: this.model.name, locations: streetViewPlaces})
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

  handleImportFile(e: Event) {
    this.statusText = "";
    const file: File = (e.target as HTMLInputElement).files![0];
    if (file) {
      this.selectedFile = file.name;

      this.fileService.parse<ImportLocations>(file).subscribe({
        next: (fileContent: ImportLocations) => {
          if (this.model.name.trim() == "") {
            this.model.name = fileContent.map_name;
          }
          var locations = fileContent.locations;
          for (var locId in locations) {
            var location = locations[locId];
            if (location.hasOwnProperty('name') && location.name.trim() != "") {
              this.handPickedManager!.addMarker(location.latLng, location.name);
            } else {
              const importRadius = 50; // for imports there should be a street view panorama in close distance
              this.handPickedManager!.addMarkerFromPanorama(location.latLng, importRadius); // retrieve a panorama for the location to get a name
            }
          }
        },
        error: (error: any) => {
          this.statusText = "Error reading file!";
          console.log(error);
        }
      });
    } else {
      this.selectedFile = "no file selected"
    }
  }
}
