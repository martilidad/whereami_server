import { Component, Input, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { RuntimeChallenge } from 'src/app/model/game-model/runtime-challenge';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent implements OnInit {

  @Input()
  challenge: RuntimeChallenge | undefined;
  statsMode: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  invite() {
    const urlTree: UrlTree = this.router.createUrlTree(['/invite'], {
      queryParams: { id: this.challenge?.id },
    });
    navigator.clipboard.writeText(window.location.origin + urlTree.toString());
    this.router.navigateByUrl(urlTree);
  }

  started(): boolean {
    return this.challenge ? this.challenge.challengelocation_set.some(cl => cl.guessed) : false;
  }

  finished(): boolean {
    return this.challenge ? this.challenge.challengelocation_set.every(cl => cl.guessed) : false;
  }

}
