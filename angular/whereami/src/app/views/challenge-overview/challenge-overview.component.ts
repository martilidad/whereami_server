import { Component, OnInit } from '@angular/core';
import {ChallengeOverview} from "../../model/game-model/challenge-overview";
import {ChallengeOverviewService} from "../../service/challenge-overview/challenge-overview.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-challenge-overview',
  templateUrl: './challenge-overview.component.html',
  styleUrls: ['./challenge-overview.component.css']
})
export class ChallengeOverviewComponent implements OnInit {

  challengeOverview: ChallengeOverview | undefined

  constructor(private overviewService: ChallengeOverviewService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(value => {
      let id = value['id']
      if(id) {
        this.overviewService.getOverview(id).subscribe(
          value => this.challengeOverview = value
        )
      }
    })
  }

}
