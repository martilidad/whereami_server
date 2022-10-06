import {StreetViewPlace} from "../../service/street-view-place/streetViewPlace";

export interface CreateGame {
  Name: string,
  Locations: StreetViewPlace[]
}
