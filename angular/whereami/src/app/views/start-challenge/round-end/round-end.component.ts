import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AUTOSTART, SettingsService } from '@service/settings/settings.service';
import { Observable } from 'rxjs';
import { GameState } from 'src/app/model/status/game-state';
import { selectChallengeId, selectDistance, selectFinished, selectScore } from '../challenge-store/challenge.selectors';
import { NextRound, RefreshMap } from '../challenge-store/challenge.actions';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-round-end',
  templateUrl: './round-end.component.html',
  styleUrls: ['./round-end.component.css'],
  animations: [
    trigger('divState', [
      state(
        'shown',
        style({
          opacity: 1,
          transform: 'scale(1) translate(0, 0)'
        })
      ),
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'scale(0.5) translate(20px, 680px)'
        })
      ),
      transition('shown => hidden', animate('300ms ease-out')),
      transition('hidden => shown', animate('300ms ease-in'))
    ])
  ]
})
export class RoundEndComponent {
  id$: Observable<number | null | undefined>;
  distance$: Observable<number>;
  score$: Observable<number>;
  finished$: Observable<boolean>;
  show = true
  
  constructor(private store: Store<{ challenge: GameState }>, private settingsService: SettingsService) {
    this.score$ = store.select(selectScore);
    this.distance$ = store.select(selectDistance)
    this.id$ = store.select(selectChallengeId)
    this.finished$ = store.select(selectFinished)
  }  
  
  refreshMap() {
    this.store.dispatch(new RefreshMap());
  }

  set autoStart(value: boolean) {
    this.settingsService.save(value, AUTOSTART);
  }

  get autoStart(): boolean {
    return this.settingsService.load(AUTOSTART);
  }

  autoStartCheckEvent(event: Event) {
    this.autoStart = (event.target as HTMLInputElement).checked
  }

  nextRound() {
    this.store.dispatch(new NextRound());
  }
}
