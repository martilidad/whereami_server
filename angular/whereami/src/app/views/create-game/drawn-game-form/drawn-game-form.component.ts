import {Component, Input, OnInit} from '@angular/core';
import {CreateDrawnGame} from "./create-drawn-game";
import {DrawingManagerComponent} from "../drawing-manager/drawing-manager.component";
import {StreetViewPlaceService} from "../../../service/street-view-place/street-view-place.service";
import {GamesService} from "../../../service/game/games.service";

@Component({
  selector: 'drawn-game-form',
  templateUrl: './drawn-game-form.component.html',
  styleUrls: ['./drawn-game-form.component.css']
})
export class DrawnGameFormComponent implements OnInit {

  model = new CreateDrawnGame(50, 10, "", false);

  drawingStatusText: string = "";

  @Input()
  public cancelAction: () => void = () => {};

  @Input()
  drawingManager: DrawingManagerComponent | undefined

  constructor(private placeService: StreetViewPlaceService,
              private gamesService: GamesService) { }

  ngOnInit(): void {
  }

  public submit() {
    //TODO report errors?
    this.placeService.getPlaces(() => this.drawingManager!.randomPoint(), message => this.drawingStatusText = message,
      this.model.quantity, this.model.minDist, this.model.allowPhotoSpheres)
      .then(places => this.gamesService.createGame({Name: this.model.name, Locations: places})
        .subscribe(value => {
          this.drawingManager?.clear()
          this.drawingStatusText = "Success"
        }, error => this.drawingStatusText = error.statusText))
      .catch(reason => this.drawingStatusText = reason)
  }

  public clearDrawings() {
    if(this.drawingManager) {
      this.drawingManager.clear();
    }
  }
}
