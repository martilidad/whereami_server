import { z } from "zod";


export const LatLngSchema = z.object({
  Lat: z.number(),
  Long: z.number()
})

export type LatLng = z.infer<typeof LatLngSchema>;
export class LatLngImpl implements LatLng{
  Lat: number;
  Long: number;

  constructor(Lat: number, Long: number) {
    this.Lat = Lat;
    this.Long = Long;
  }

  public toLatLng(google_ns: typeof google): google.maps.LatLng {
    return new google_ns.maps.LatLng(this.Lat, this.Long)
  }

  static of(pos: google.maps.LatLng) {
    return new LatLngImpl(pos.lat(), pos.lng());
  }
}
