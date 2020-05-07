var map;
$(document).ready( function () {
  // Mini map setup
  var mapOptions = {
    center: new google.maps.LatLng(0, 0, true),
    zoom: 1,
    mapTypeControl: false,
    streetViewControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('createGameMap'), mapOptions);
});

function submit() {
    var bounds = map.getBounds();
    var southWest = bounds.getSouthWest();
    var northEast = bounds.getNorthEast();
    var lngSpan = northEast.lng() - southWest.lng();
    var latSpan = northEast.lat() - southWest.lat();
    var quantity = $('#quantity')[0].val();
    for (let i = 0; i < quantity; i++) {
        //TODO loop this until place doesn't collide with one selected before
        //what's the criteria for stopping the loop?
        var point = new google.maps.LatLng(
					southWest.lat + latSpan * Math.random(),
					southWest.lng + lngSpan * Math.random());
        //TODO hidden element pano
        var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));

        var webService = new google.maps.StreetViewService();
        var checkaround = 5000;
        webService.getPanoramaByLocation(point,checkaround ,function(panoData) {
        if(panoData){
             if(panoData.location){
                if(panoData.location.latLng){
                    //confirm this is a new place
                }
            }
        }
        });
    }

}

