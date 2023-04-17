import {Component, OnInit, ViewChild} from '@angular/core';
import {Challenge, ChallengeScore} from '@client/models';
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

  scores: ChallengeScore[] = []

  ngOnInit(): void {
  }

  showStats(challenge: Challenge): void {
    this.scores = challenge.scores;
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
