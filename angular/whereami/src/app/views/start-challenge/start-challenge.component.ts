import { Component, OnInit } from '@angular/core';
import {AbstractGoogleMapsComponent} from "../abstract-google-maps-component";
import {HandleError, HttpErrorHandler} from "../../http-error-handler.service";
import {HttpClient} from "@angular/common/http";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-start-challenge',
  templateUrl: './start-challenge.component.html',
  styleUrls: ['./start-challenge.component.css']
})
export class StartChallengeComponent extends AbstractGoogleMapsComponent{

  constructor(httpClient: HttpClient, httpErrorHandler: HttpErrorHandler) {
    super(httpClient, httpErrorHandler.createHandleError('StartChallengeComponent'));
  }

}
