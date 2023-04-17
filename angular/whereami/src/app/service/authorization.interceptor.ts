import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let result = request;
    if(request.url.startsWith("/") && this.userService.token) {
      result = request.clone({
        setHeaders: {
          'Authorization': 'JWT ' + this.userService.token
        }
      });
    }
    return next.handle(result);
  }
}
