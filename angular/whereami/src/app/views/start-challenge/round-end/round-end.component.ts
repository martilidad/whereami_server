import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TaggedVideo } from '@service/gfycat/gfycat-response';
import { GfycatService } from '@service/gfycat/gfycat.service';
import { AUTOSTART, REACTIONS, SettingsService } from '@service/settings/settings.service';
import { Observable, Subject, of, startWith, switchMap } from 'rxjs';
import { GameState } from 'src/app/model/status/game-state';
import { NextRound, RefreshMap } from '../challenge-store/challenge.actions';
import { selectChallengeId, selectDistance, selectFinished, selectScore } from '../challenge-store/challenge.selectors';
import { MAX_POINT_DISTANCE } from '../challenge-store/score-calculation.effects';

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
          transform: 'scale(1) translate(-50%, 0)'
        })
      ),
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'scale(0) translate(+100%, 0)'
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
  taggedVideo$: Observable<TaggedVideo|null>
  newGif$ = new Subject<void>;
  
  constructor(private store: Store<{ challenge: GameState }>, private settingsService: SettingsService, private gfycatService: GfycatService) {
    this.score$ = store.select(selectScore);
    this.distance$ = store.select(selectDistance)
    this.id$ = store.select(selectChallengeId)
    this.finished$ = store.select(selectFinished)
    this.taggedVideo$ = this.newGif$.pipe(
      startWith(null),
      switchMap(() => this.settingsService.load$(REACTIONS)),
      switchMap(reaction => {
        if (!reaction) {
          return of(null);
        } else {
          return store.select(selectScore).pipe(
            switchMap(score => this.gfycatService.fetchGifForScore(score, MAX_POINT_DISTANCE))
          );
        }
      })
    );
  }  
  
  refreshMap() {
    this.store.dispatch(new RefreshMap());
  }

  nextRound() {
    this.store.dispatch(new NextRound());
  }
}
