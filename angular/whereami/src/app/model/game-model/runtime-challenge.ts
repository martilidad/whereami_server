import {ChallengeLocation, ChallengeLocationImpl} from "./challenge-location";
import {LatLng} from "../lat-lng";

export interface RuntimeChallenge {
  Time: number,
  Challenge_Locations: ChallengeLocation[]
  Ignored_Count: number,
  Challenge_ID: number,
  boundary_array: LatLng[],
  Name: string

}

export function boundsFromChallenge(challenge: RuntimeChallenge, google_ns: typeof google) {
  const boundary_array = challenge.boundary_array;
  const challenge_Locations = challenge.Challenge_Locations;
  let bounds: google.maps.LatLngBounds;
  if (boundary_array.length == 2 && challenge_Locations.length > 0) {
    let boundsCandidate = new google.maps.LatLngBounds(
      {
        lat: boundary_array[0].Lat,
        lng: boundary_array[0].Long,
      },
      {
        lat: boundary_array[1].Lat,
        lng: boundary_array[1].Long,
      }
    );
    let boundsCandidate2 = new google.maps.LatLngBounds(
      {
        lat: boundary_array[1].Lat,
        lng: boundary_array[1].Long,
      },
      {
        lat: boundary_array[0].Lat,
        lng: boundary_array[0].Long,
      }
    );
    bounds = boundsCandidate.contains(new ChallengeLocationImpl(challenge_Locations[0]).toLatLng(google_ns)) ? boundsCandidate : boundsCandidate2;
  } else {
    bounds = new google.maps.LatLngBounds();
    boundary_array.forEach((latLng) => bounds.extend({ lat: latLng.Lat, lng: latLng.Long })
    );
  }
  return bounds;
}
