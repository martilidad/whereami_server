export class StreetViewPlace {


  constructor(private Lat: number, private Long: number, private Name: string) {
  }

  public toLatLng(): google.maps.LatLng {
      return new google.maps.LatLng(this.Lat, this.Long)
  }
}
