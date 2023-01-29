

import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { BACKEND_HOST } from "src/environments/environment";


@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apiReq = req;
    if(this.shouldIntercept(req)) {
      //interceptor for debugging against django
      apiReq = req.clone({ url: `${window.location.protocol}//${this.hostName}${req.url}` });
    }
    return next.handle(apiReq);
  }

  private get hostName() {
    return BACKEND_HOST ? BACKEND_HOST : window.location.hostname;
  }

  private parseUrl(req: HttpRequest<any>): URL {
    try {
      return new URL(req.url);
    } catch (TypeError) {
      return new URL(req.url, window.location.href);
    }

  }
  
  //only intercept requests that go to our Backend
  private shouldIntercept(req: HttpRequest<any>): boolean {
    return this.parseUrl(req).host == window.location.host;
  }
}
