export interface ChallengeLocation {
  Challenge_Location_ID: number
  Lat: number
  Long: number
  Name: string
}

export class ChallengeLocationImpl implements ChallengeLocation{

  Challenge_Location_ID: number;
  Lat: number;
  Long: number;
  Name: string;

  constructor(other: ChallengeLocation) {
    this.Challenge_Location_ID = other.Challenge_Location_ID;
    this.Lat = other.Lat
    this.Long = other.Long
    this.Name = other.Name
  }

  public toLatLng(): google.maps.LatLng {
    return new google.maps.LatLng(this.Lat, this.Long)
  }

}
