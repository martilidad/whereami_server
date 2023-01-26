import {Component, OnInit, ViewChild} from '@angular/core';
import {ChallengesService} from "../../../service/challenge/challenges.service";
import {ScoreService} from "../../../service/score/score.service";
import {Score} from "../../../model/game-model/score";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";

@Component({
  selector: 'challenge-scores',
  templateUrl: './challenge-scores.component.html',
  styleUrls: ['./challenge-scores.component.css']
})
export class ChallengeScoresComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  scoreTable: any = DataTableDirective;

  dtOptions: DataTables.Settings = {
    order: [[0, "desc"]],
    searching: false,
    paging: false
    
  };
  dtTrigger: Subject<any> = new Subject<any>();

  scores: Score[] = []

  constructor(private scoreService: ScoreService) {
  }

  ngOnInit(): void {
  }

  showStats(id: number): void {
    this.scoreService.getScores(id)
      .subscribe(value => {
        this.scores = value;
        this.rerenderDt()
      })
  }

  rerenderDt(): void {
    if(this.scoreTable.dtInstance) {
      this.scoreTable.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next(null);
      });
    } else {
      this.dtTrigger.next(null)
    }
  }

}
