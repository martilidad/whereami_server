export class StreetViewPlace {


  constructor(private Lat: number, private Long: number, private Name: string) {
  }

  public toLatLng(google_ns: typeof google): google.maps.LatLng {
      return new google_ns.maps.LatLng(this.Lat, this.Long)
  }
}
