import { Component, HostListener } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, first } from "rxjs";
import { GameState } from "../../model/status/game-state";
import { EndedRound, ToStart } from './challenge-store/challenge.actions';
import { selectHumanReadableRound, selectRemainingTime, selectRoundEnded } from './challenge-store/challenge.selectors';

@UntilDestroy()
@Component({
  selector: 'app-start-challenge',
  templateUrl: './start-challenge.component.html',
  styleUrls: ['./start-challenge.component.css']
  //TODO add endgame fadein animation
})
export class StartChallengeComponent {

  @HostListener('window:beforeunload')
  confirmLeave(event: BeforeUnloadEvent) {
    event.preventDefault()
    event.returnValue = 'Are you sure you want to leave?'
  }

  id: number | undefined
  ignorePreviousGuesses: boolean | undefined
  humanReadableRound$: Observable<number | null>;
  time$: Observable<number>;
  roundEnded$: Observable<boolean>;

  constructor(private store: Store<{ challenge: GameState }>) {
    this.humanReadableRound$ = this.store.select(selectHumanReadableRound);
    this.time$ = this.store.select(selectRemainingTime);
    this.roundEnded$ = this.store.select(selectRoundEnded);
  }

  endRound() {
    this.roundEnded$.pipe(untilDestroyed(this), first()).subscribe(roundEnded => {
      if (!roundEnded) {
        this.store.dispatch(new EndedRound());
      }
    });
  }
  
  toStart() {
    this.store.dispatch(new ToStart());
  }


}
