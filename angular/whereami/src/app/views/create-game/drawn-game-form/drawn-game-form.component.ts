import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CreateDrawnGame } from './create-drawn-game';
import { DrawingManagerComponent } from '../drawing-manager/drawing-manager.component';
import { StreetViewPlaceService } from '../../../service/street-view-place/street-view-place.service';
import { GamesService } from '../../../service/game/games.service';

@Component({
  selector: 'drawn-game-form',
  templateUrl: './drawn-game-form.component.html',
  styleUrls: ['./drawn-game-form.component.css'],
})
export class DrawnGameFormComponent implements OnInit {
  model = new CreateDrawnGame(50, 10, '', false);

  drawingStatusText: string = '';

  @Output()
  cancelled = new EventEmitter<any>();

  @Input()
  drawingManager: DrawingManagerComponent | undefined;

  constructor(
    private placeService: StreetViewPlaceService,
    private gamesService: GamesService
  ) {}

  ngOnInit(): void {}

  inProgress = false;

  public submit() {
    this.inProgress = true;
    this.placeService
      .getPlaces(
        () => this.drawingManager!.randomPoint(),
        (message) => (this.drawingStatusText = message),
        this.model.quantity,
        this.model.minDist,
        this.model.allowPhotoSpheres
      )
      .then((places) =>
        this.gamesService
          .createGame({id: null, name: this.model.name, locations: places})
          .subscribe({
            next: () => {
              this.drawingManager?.clear();
              this.drawingStatusText = 'Success';
            },
            error: (value) => (this.drawingStatusText = value.error),
          })
      )
      .catch(reason => this.drawingStatusText = reason)
      .finally(() => this.inProgress = false);
  }

  public clearDrawings() {
    if (this.drawingManager) {
      this.drawingManager.clear();
    }
  }

  public cancel() {
    this.cancelled.emit();
  }
}
