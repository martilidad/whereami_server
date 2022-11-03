import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserService } from './user/user.service';


@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) { }

  private handleUnauthorized(err: HttpErrorResponse): Observable<any> {
    if (err.status === HttpStatusCode.Unauthorized) {
      this.userService.logout();
    }
    return throwError(() => err);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => this.handleUnauthorized(err)));
  }
}
