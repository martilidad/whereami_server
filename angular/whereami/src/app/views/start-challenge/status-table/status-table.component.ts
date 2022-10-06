import {Component, Input, OnInit} from '@angular/core';
import {UserChallengeStatus} from "../../../model/status/user-challenge-status";
import {
  BoundChallengeStatusService,
  ChallengeStatusService
} from "../../../service/challenge-status/challenge-status.service";

@Component({
  selector: 'status-table',
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.css']
})
export class StatusTableComponent implements OnInit {

  @Input()
  challengeId: number | undefined

  users: UserChallengeStatus[] = []
  boundStatusService: BoundChallengeStatusService | undefined

  constructor(private statusService: ChallengeStatusService) {

  }

  ngOnInit(): void {
    this.boundStatusService = this.statusService.bind(this.challengeId!)
    //TODO subscribe to status service
  }

}
