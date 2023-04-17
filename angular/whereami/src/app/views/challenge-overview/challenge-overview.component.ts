import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Challenge } from '@client/models';
import { ChallengesService } from 'src/app/service/challenge/challenges.service';

@Component({
  selector: 'app-challenge-overview',
  templateUrl: './challenge-overview.component.html',
  styleUrls: ['./challenge-overview.component.css']
})
export class ChallengeOverviewComponent implements OnInit {

  private _challengeOverview: Challenge | undefined;
  public get challengeOverview(): Challenge | undefined {
    return this._challengeOverview;
  }
  public set challengeOverview(value: Challenge | undefined) {
    this._challengeOverview = value;
    this.winner = value?.scores && value?.scores.length > 0 ? value?.scores[0]?.username : undefined;
  }
  winner: string | undefined

  constructor(private challengesService: ChallengesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(value => {
      let id = value['id']
      if(id) {
        this.challengesService.getChallenge(id).subscribe(
          value => this.challengeOverview = value
        )
      }
    })
  }

}
