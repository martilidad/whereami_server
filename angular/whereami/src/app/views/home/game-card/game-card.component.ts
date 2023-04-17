import { Component, Input, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Challenge } from '@client/models'

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent implements OnInit {

  @Input()
  challenge: Challenge | undefined;
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
    return this.challenge ? this.challenge.locations.some(cl => cl.guessed) : false;
  }

  finished(): boolean {
    return this.challenge ? this.challenge.locations.every(cl => cl.guessed) : false;
  }

}
