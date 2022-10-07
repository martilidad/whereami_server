export interface LatLng {
  Lat: number
  Long: number
}

export class LatLngImpl implements LatLng{
  Lat: number;
  Long: number;

  constructor(Lat: number, Long: number) {
    this.Lat = Lat;
    this.Long = Long;
  }

  public toLatLng(): google.maps.LatLng {
    return new google.maps.LatLng(this.Lat, this.Long)
  }

  static of(pos: google.maps.LatLng) {
    return new LatLngImpl(pos.lat(), pos.lng());
  }
}