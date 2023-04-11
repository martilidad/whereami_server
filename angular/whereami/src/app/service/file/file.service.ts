import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  parse<T>(file: File): Observable<T> {
    var fileUrl = URL.createObjectURL(file);
    return this.http.get<T>(fileUrl);
  }
}
