import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Game } from 'src/app/api/generated/client/models';
import { GOOGLE } from 'src/app/app.module';

@Component({
  selector: 'app-preview-map',
  templateUrl: './preview-map.component.html',
  styleUrls: ['./preview-map.component.css'],
})
export class PreviewMapComponent implements OnInit {

  private _game: Game | undefined;
  mapOptions: google.maps.MapOptions;
  private _map: GoogleMap | undefined;

  @ViewChild('map')
  set map(value: GoogleMap) {
    this._map = value;
    this.onInputChanged();
  }

  @Input('game')
  set game(value: Game | undefined) {
    this._game = value;
    this.onInputChanged();
  }

  ngOnInit(): void {}

  constructor(@Inject(GOOGLE) private google_ns: typeof google) {
    this.mapOptions = {
      center: new google_ns.maps.LatLng(0, 0, true),
      zoom: 1,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google_ns.maps.MapTypeId.ROADMAP,
    };
  }

  
  private outline: {setMap: (aMap: google.maps.Map | null) => void} | undefined;

  onInputChanged() {
    if (this._map && this._game) {
      let bounds = new this.google_ns.maps.LatLngBounds();
      this._game.locations.forEach((location) => bounds.extend({ lat: location.lat, lng: location.long }));
      this._map.fitBounds(bounds);
      let map = this._map.googleMap!;
      this.outline?.setMap(null);
      if (this._game.locations.length < 10) {
        this.outline = new this.google_ns.maps.Rectangle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.1,
          map,
          bounds: bounds,
        });
      } else {
        const diagonal =
          this.google_ns.maps.geometry.spherical.computeDistanceBetween(
            bounds.getNorthEast(),
            bounds.getSouthWest()
          );
        const maxLat = Math.abs(
          bounds.getNorthEast().lat() - bounds.getSouthWest().lat()
        );
        const maxLng = Math.abs(
          bounds.getNorthEast().lng() - bounds.getSouthWest().lng()
        );
        let circles = this._game.locations.map((location) => {
          let circle = this.drawCircle(
            {
              lat: location.lat + this.randomOffset(maxLat),
              lng: location.long + this.randomOffset(maxLng),
            },
            diagonal / 6000
          ); // + this.randomOffset(maxLng)
          return circle;
        });
        this.outline = new this.google_ns.maps.Polygon({
          paths: circles,
          map: map,
          strokeOpacity: 0,
        });
      }
    }
  }
  
  /**
   * shamelessly copied from https://stackoverflow.com/questions/23154254/google-map-multiple-overlay-no-cumulative-opacity
   * @radius in km
   */
   private drawCircle(point: google.maps.LatLngLiteral, radius: number) {
    var d2r = Math.PI / 180; // degrees to radians
    var r2d = 180 / Math.PI; // radians to degrees
    var earthsradius = 6378; // 6378 is the radius of the earth in km
    var points = 32;

    // find the raidus in lat/lon
    var rlat = (radius / earthsradius) * r2d;
    var rlng = rlat / Math.cos(point.lat * d2r);

    var extp = new Array();
    for (var i = 0; i <= points; i = i + 1) {
      var theta = Math.PI * (i / (points / 2));
      let ey = point.lng + rlng * Math.cos(theta); // center a + radius x * cos(theta)
      let ex = point.lat + rlat * Math.sin(theta); // center b + radius y * sin(theta)
      extp.push(new this.google_ns.maps.LatLng(ex, ey));
    }
    return extp;
  }

  /**
   * 
   * @param diagonal aprox max distance of map, diagonally
   * @returns 
   */
  private randomOffset(diagonal: number): number {
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    return Math.random() * (diagonal / 5) * plusOrMinus;
  }

}
