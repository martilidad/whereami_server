import { Component, EventEmitter } from '@angular/core';
import { UserService } from '../../service/user/user.service';
import { User } from '../../service/user/user';
import { catchError, map, Observable, share } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandler } from 'src/app/http-error-handler.service';
import { GoogleMapsApiService } from 'src/app/service/google-maps-api/google-maps-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'whereami';
  /**
   * An object representing the user for the login form
   */
  public user: User = new User('', '');

  constructor(
    public userService: UserService,
    public gMapsApiService: GoogleMapsApiService
  ) {}
}
