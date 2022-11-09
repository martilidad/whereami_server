import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HandPickedManagerComponent} from "../hand-picked/hand-picked-manager.component";
import {DrawingManagerComponent} from "../drawing-manager/drawing-manager.component";
import {CreateHandpickedGame} from "./create-handpicked-game";
import {GamesService} from "../../../service/game/games.service";
import {StreetViewPlace} from "../../../service/street-view-place/streetViewPlace";

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

  public statusText: string = ""

  public model = new CreateHandpickedGame("")


  constructor(private gamesService: GamesService) { }

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
}
