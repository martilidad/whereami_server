import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import { BACKEND_HOST } from "src/environments/environment";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //interceptor for debugging against django
    const apiReq = req.clone({ url: `${window.location.protocol}//${this.hostName}${req.url}` });
    return next.handle(apiReq);
  }

  private get hostName() {
    return BACKEND_HOST ? BACKEND_HOST : window.location.hostname;
  }
}
