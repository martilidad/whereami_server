import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ChallengesService} from "../../service/challenge/challenges.service";
import {GamesService} from "../../service/game/games.service";
import {Game} from "../../service/game/game";
import {Challenge} from "../../service/challenge/challenge";
import {Subject} from "rxjs";
import * as moment from 'moment';
import {DataTableDirective} from "angular-datatables";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [GamesService, ChallengesService]
})
export class IndexComponent implements OnInit, OnDestroy {
  // @ViewChild(DataTableDirective, {static: false})
  // datatableElement: any = DataTableDirective;
  dtOptions: DataTables.Settings = {
    order: [[4, "desc"]],
    lengthMenu: [[3, 5, 10, 25, 50, -1], [3, 5, 10, 25, 50, "All"]],
    columnDefs: [{
      targets: 0,
      render: this.renderDateTime
    }]
  };
  dtTrigger: Subject<any> = new Subject<any>();
  games: Game[] = [];
  challenges: Challenge[] = [];

  constructor(private challengesService: ChallengesService,
              private gamesService: GamesService) { }

  ngOnInit(): void {
    this.challengesService.getChallenges()
      .subscribe(challenges => {
        this.challenges = challenges;
        this.dtTrigger.next(null);
      });
    this.gamesService.getGames()
      .subscribe(games => {
        this.games = games;
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


}
