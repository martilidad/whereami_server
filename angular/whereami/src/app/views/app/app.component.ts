import { Component } from '@angular/core';
import {UserService} from "../../service/user/user.service";
import {User} from "../../service/user/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'whereami';
  /**
   * An object representing the user for the login form
   */
  public user: User = new User('user', 'changeme');

  constructor(public userService: UserService) {
  }

  ngOnInit() {
    this.login();
  }

  login() {
    this.userService.login(this.user);
  }

  refreshToken() {
    this.userService.refreshToken();
  }

  logout() {
    this.userService.logout();
  }
}
