import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GoogleMapsApiService } from './google-maps-api.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsGuard implements CanMatch {
  constructor(private mapsService: GoogleMapsApiService) {}
  canMatch(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.mapsService.apiLoaded
  }


}