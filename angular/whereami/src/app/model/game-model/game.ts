import { LatLng } from "../lat-lng"

export interface Game {
  id: number,
  name: string,
  location_count: number
  locations: LatLng[]
}
