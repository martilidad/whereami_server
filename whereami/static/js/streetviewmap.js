//
// Streetview Map
//

function svinitialize() {

  console.log('No peaking!');
  var location = window.loc;

  // Do streetview
  var whoamiLocation = new google.maps.LatLng(location['Lat'], location['Long']);
  var streetViewService = new google.maps.StreetViewService();
  var STREETVIEW_MAX_DISTANCE = 100;

  streetViewService.getPanoramaByLocation(whoamiLocation, STREETVIEW_MAX_DISTANCE, function(streetViewPanoramaData, status) {
    if (status === google.maps.StreetViewStatus.OK) {

      // We have a streetview pano for this location, so let's roll
      var panoramaOptions = {
        position: whoamiLocation,
        addressControl: false,
        linksControl: false,
        pov: {
          heading: 270,
          zoom: 1,
          pitch: -10
        },
        visible: true
      };

      var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);

    } else {
      // no street view available in this range, or some error occurred
      alert('Streetview is not available for this location :( Mind telling us that you saw this?');
    }
  });
};
