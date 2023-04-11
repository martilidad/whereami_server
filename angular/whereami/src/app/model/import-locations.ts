import {} from "@angular/google-maps";

export interface ImportLocations {
  map_name: string
  locations: Array<ImportLocation>
}

export interface ImportLocation {
    name: string
    latLng: google.maps.LatLng
}
