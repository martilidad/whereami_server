import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject, WebSocketSubjectConfig } from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class WebSocketFactoryService {

  constructor(){}

  public webSocket<T>(urlConfigOrSource: string | WebSocketSubjectConfig<T>): WebSocketSubject<T> {
    return webSocket<T>(urlConfigOrSource);
  }
}