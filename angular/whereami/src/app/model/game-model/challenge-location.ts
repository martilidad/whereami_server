export interface ChallengeLocation {
  Challenge_Location_ID: number
  Lat: number
  Long: number
  Name: string
  guessed: boolean
}

export class ChallengeLocationImpl implements ChallengeLocation{

  Challenge_Location_ID: number;
  Lat: number;
  Long: number;
  Name: string;
  guessed: boolean;

  constructor(other: ChallengeLocation) {
    this.Challenge_Location_ID = other.Challenge_Location_ID;
    this.Lat = other.Lat
    this.Long = other.Long
    this.Name = other.Name
    this.guessed = other.guessed
  }

  public toLatLng(google_ns: typeof google): google.maps.LatLng {
    return new google_ns.maps.LatLng(this.Lat, this.Long)
  }

}
