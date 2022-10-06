import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ChallengesService} from "../../service/challenge/challenges.service";
import {GamesService} from "../../service/game/games.service";
import {Game} from "../../model/game-model/game";
import {Challenge} from "../../model/game-model/challenge";
import {Subject} from "rxjs";
import * as moment from 'moment';
import {DataTableDirective} from "angular-datatables";
import {ADTSettings} from "angular-datatables/src/models/settings";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [GamesService, ChallengesService]
})
export class IndexComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  challengeTable: any = DataTableDirective;

  dtOptions: DataTables.Settings = {
    order: [[4, "desc"]],
    lengthMenu: [[3, 5, 10, 25, 50, -1], [3, 5, 10, 25, 50, "All"]],
    columnDefs: [{
      targets: 0,
      render: this.renderDateTime
    }]
  };
  dtTrigger: Subject<any> = new Subject<any>();
  challenges: Challenge[] = [];

  constructor(private challengesService: ChallengesService) { }

  ngOnInit(): void {
    this.updateChallenges();
  }

  updateChallenges() {
    this.challengesService.getChallenges()
      .subscribe(challenges => {
        this.challenges = challenges;
        this.rerenderDt();
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  renderDateTime(data: any, type: any, row: any, meta: DataTables.CellMetaSettings): any {
    if (type === 'display') {
      if (moment(data).isAfter(moment().subtract(1, 'days'))) {
        return `<div title='${moment(data).format('LLLL')}'> ${moment(data).fromNow()}</div>`;
      } else {
        return moment(data).format('LLLL');
      }
    } else {
      return data;
    }
  }

  rerenderDt(): void {
    if(this.challengeTable.dtInstance) {
      this.challengeTable.dtInstance.then((dtInstance: DataTables.Api) => {
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
