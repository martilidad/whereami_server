import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //interceptor for debugging against django
    const apiReq = req.clone({ url: `http://127.0.0.1:8000${req.url}` });
    return next.handle(apiReq);
  }
}
