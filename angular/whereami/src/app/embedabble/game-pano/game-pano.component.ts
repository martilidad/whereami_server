import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import { filter, map, Observable, Subject, timer } from 'rxjs';
import { GOOGLE } from 'src/app/app.module';
import { LatLng } from 'src/app/model/lat-lng';
import { GHOST, SettingsService } from 'src/app/service/settings/settings.service';
import { Optional } from 'typescript-optional';

@Component({
  selector: 'game-pano',
  templateUrl: './game-pano.component.html',
  styleUrls: ['./game-pano.component.css'],
})
export class GamePanoComponent {
  private pano: google.maps.StreetViewPanorama | undefined;
  private startLocation: google.maps.LatLng | undefined;
  private startMarker: google.maps.Marker | undefined;

  constructor(@Inject(GOOGLE) private google_ns: typeof google,
  private settingsService: SettingsService) {}

  @ViewChild('panoDiv')
  set panoDiv(panoDiv: ElementRef) {
    this.pano = new this.google_ns.maps.StreetViewPanorama(
      panoDiv.nativeElement,
      {
        addressControl: false,
        linksControl: false,
        showRoadLabels: false,
        visible: true,
        fullscreenControl: false,
      }
    );
  }

  reset(): void {
    if (this.startLocation) {
      this.pano!.setPosition(this.startLocation);
    }
  }

  setLocation(location: google.maps.LatLng) {
    this.startLocation = location;
    this.pano!.setPosition(location);
    Optional.ofNullable(this.startMarker).ifPresentOrElse(
      marker => marker.setPosition(location),
      () => this.startMarker = new this.google_ns.maps.Marker({
        clickable: false,
        position: location,
        map: this.pano,
        animation: this.google_ns.maps.Animation.DROP
      })
    );
  }

  ghost(): Observable<google.maps.LatLng> {
    let subject = new Subject<google.maps.LatLng | null | undefined>();
    this.pano?.addListener('pano_changed', () => {
      this.settingsService.listen(GHOST, (enabled: boolean) => {
        if(enabled) {
          subject.next(this.pano?.getLocation()?.latLng);
        }
      });
    });
    return subject.pipe(
      filter((val) => val != undefined && val != null)
    ) as Observable<google.maps.LatLng>;
  }

  private ghostMap: Map<string, google.maps.Marker> = new Map();

  drawGhost(name: string, location: google.maps.LatLng) {
    this.settingsService.listen(GHOST, enabled => {
      Optional.ofNullable(this.ghostMap.get(name)).ifPresentOrElse(
        (marker) => {
          marker.setPosition(location);
          marker.setAnimation(this.google_ns.maps.Animation.BOUNCE);
        },
        () =>
          this.ghostMap.set(
            name,
            new this.google_ns.maps.Marker({
              clickable: false,
              position: location,
              map: enabled ? this.pano : null,
              title: name,
              label: name,
              icon: "/assets/orange_marker.png",
              animation: this.google_ns.maps.Animation.BOUNCE
            })
          )
      );
    }, enabled => {
      this.ghostMap.forEach(marker => marker.setMap(enabled ? this.pano! : null));
    })
  }
}
