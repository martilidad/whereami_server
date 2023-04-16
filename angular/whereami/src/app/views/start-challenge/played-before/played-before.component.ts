import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameState } from 'src/app/model/status/game-state';
import { selectChallengeId } from '../challenge-store/challenge.selectors';
import { Observable, filter } from 'rxjs';

@Component({
  selector: 'app-played-before',
  templateUrl: './played-before.component.html',
  styleUrls: ['./played-before.component.css']
})
export class PlayedBeforeComponent {
  id$: Observable<number | null | undefined>;

  constructor(store: Store<{ challenge: GameState }>) {
    this.id$ = store.select(selectChallengeId)
  }

}
