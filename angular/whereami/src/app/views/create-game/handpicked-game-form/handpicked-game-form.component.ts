import {Component, Input, OnInit} from '@angular/core';
import {HandPickedManagerComponent} from "../../../embedabble/hand-picked/hand-picked-manager.component";
import {DrawingManagerComponent} from "../../../embedabble/drawing-manager/drawing-manager.component";
import {CreateHandpickedGame} from "./create-handpicked-game";
import {GamesService} from "../../../service/game/games.service";
import {StreetViewPlace} from "../../../service/street-view-place/streetViewPlace";

@Component({
  selector: 'handpicked-game-form',
  templateUrl: './handpicked-game-form.component.html',
  styleUrls: ['./handpicked-game-form.component.css']
})
export class HandpickedGameFormComponent implements OnInit {

  @Input()
  public handPickedManager!: HandPickedManagerComponent

  @Input()
  public cancelAction: () => void = () => {}


  public statusText: string = ""

  public model = new CreateHandpickedGame("")


  constructor(private gamesService: GamesService) { }

  ngOnInit(): void {
  }


  submit() {
    let streetViewPlaces = this.handPickedManager.markers.map(marker => new StreetViewPlace(marker.getPosition()!.lat(), marker.getPosition()!.lng(), marker.getTitle()!));
    this.gamesService.createGame({Name: this.model.name, Locations: streetViewPlaces})
      .subscribe(value => this.statusText = "Success")
  }
}
