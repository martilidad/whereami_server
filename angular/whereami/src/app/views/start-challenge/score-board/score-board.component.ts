import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameState } from 'src/app/model/status/game-state';
import { selectHumanReadableRound, selectScore, selectTotalRounds, selectTotalScore } from '../challenge-store/challenge.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css']
})
export class ScoreBoardComponent {
  humanReadableRound$: Observable<number | null>;
  totalRounds$: Observable<number | undefined>;
  score$: Observable<number>;
  totalScore$: Observable<number>;

  constructor(store: Store<{ challenge: GameState }>) {
    this.humanReadableRound$ = store.select(selectHumanReadableRound);
    this.totalRounds$ = store.select(selectTotalRounds);
    this.score$ = store.select(selectScore);
    this.totalScore$ = store.select(selectTotalScore)
  }

}
