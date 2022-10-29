import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChallengesService} from "../../service/challenge/challenges.service";
import {Challenge} from "../../model/game-model/challenge";
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import { Router, UrlTree } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  challengeTable: any = DataTableDirective;

  dtOptions: DataTables.Settings = {
    order: [[4, "desc"]],
    lengthMenu: [[3, 5, 10, 25, 50, -1], [3, 5, 10, 25, 50, "All"]]
  };
  dtTrigger: Subject<any> = new Subject<any>();
  challenges: Challenge[] = [];

  constructor(private challengesService: ChallengesService,
    private router: Router) { }

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

  invite(id: number) {
    const urlTree: UrlTree = this.router.createUrlTree(['/invite'], {
      queryParams: { id: id },
    });
    navigator.clipboard.writeText(window.location.origin + urlTree.toString());
    this.router.navigateByUrl(urlTree);
  }

}
