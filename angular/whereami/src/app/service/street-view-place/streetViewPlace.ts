import { z } from "zod"

export const StreetViewPlaceSchema = z.object({
  Lat: z.number(),
  Long: z.number(),
  Name: z.string()
})

export type StreetViewPlace = z.infer<typeof StreetViewPlaceSchema>;
export class StreetViewPlaceImpl implements StreetViewPlace {


  constructor(public Lat: number, public Long: number, public Name: string) {
  }

  public toLatLng(google_ns: typeof google): google.maps.LatLng {
      return new google_ns.maps.LatLng(this.Lat, this.Long)
  }
}
