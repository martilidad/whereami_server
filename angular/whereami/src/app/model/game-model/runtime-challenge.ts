import {ChallengeLocation, ChallengeLocationImpl} from "./challenge-location";
import {LatLng} from "../lat-lng";
import { Game } from "./game";

export interface RuntimeChallenge {
  id: number,
  Time: number,
  challengelocation_set: ChallengeLocation[]
  Ignored_Count: number,
  Challenge_ID: number,
  all_locations: LatLng[],
  location_count: number,
  game: Game,
  Name: string

}

export function boundsFromChallenge(challenge: RuntimeChallenge, google_ns: typeof google) {
  const all_locations = challenge.game.locations;
  const challenge_Locations = challenge.challengelocation_set;
  let bounds: google.maps.LatLngBounds;
  if (all_locations.length == 2 && challenge_Locations.length > 0) {
    let boundsCandidate = new google.maps.LatLngBounds(
      {
        lat: all_locations[0].Lat,
        lng: all_locations[0].Long,
      },
      {
        lat: all_locations[1].Lat,
        lng: all_locations[1].Long,
      }
    );
    let boundsCandidate2 = new google.maps.LatLngBounds(
      {
        lat: all_locations[1].Lat,
        lng: all_locations[1].Long,
      },
      {
        lat: all_locations[0].Lat,
        lng: all_locations[0].Long,
      }
    );
    bounds = boundsCandidate.contains(new ChallengeLocationImpl(challenge_Locations[0]).toLatLng(google_ns)) ? boundsCandidate : boundsCandidate2;
  } else {
    bounds = new google.maps.LatLngBounds();
    all_locations.forEach((latLng) => bounds.extend({ lat: latLng.Lat, lng: latLng.Long })
    );
  }
  return bounds;
}
