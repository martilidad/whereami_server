var map;
var webService = new google.maps.StreetViewService();
$(document).ready(function () {
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

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return Value * Math.PI / 180;
}

async function submit() {
  // give up after getting 10 duplicate/unusable locations
  var maxIgnores = 10;
  var ignores = 0;
  var bounds = map.getBounds();
  var southWest = bounds.getSouthWest();
  var northEast = bounds.getNorthEast();
  var lngSpan = northEast.lng() - southWest.lng();
  var latSpan = northEast.lat() - southWest.lat();
  var quantity = $('#quantity').val();
  var minDist = $('#minDist').val();
  var name = $('#name').val();
  var places = [];
  var checkaround = 500000;
  while (places.length < quantity && ignores <= maxIgnores) {
    var point = new google.maps.LatLng(
      southWest.lat() + latSpan * Math.random(),
      southWest.lng() + lngSpan * Math.random());
    //synchronus request, wait for api return
    var panoData = await new Promise(function (resolve, reject) { webService.getPanoramaByLocation(point, checkaround, function (data) { resolve(data); }) });
    if (panoData && panoData.location && panoData.location.latLng) {
      var latLng = panoData.location.latLng;
      //confirm this is a new place
      var newLocation = true;
      for (const i in places) {
        const dist = calcCrow(places[i]['Lat'], places[i]['Long'], latLng.lat(), latLng.lng());
        if (dist < minDist) {
          newLocation = false;
          ignores++;
          break;
        }
      }
      if (newLocation) {
        places.push({ Lat: latLng.lat(), Long: latLng.lng(), Name: panoData.location.shortDescription});
      }
    } else {
      ignores++;
    }
    $('#loadingText').text(`Loading Locations ${places.length}/${quantity} Ignored: ${ignores}/${maxIgnores}`);
  }
  $('#loadingText').text('Sending to Server, this can take some time.');
  $.ajax({
    url: "/game",
    method: "POST",
    headers: {"X-CSRFToken": Cookies.get('csrftoken')},
    contentType: 'application/json',
    data: JSON.stringify({
      Name: name,
      Locations: places
    }),
    success: function () {
      $('#loadingText').text('Success');
    },
    error: function (result) {
      $('#loadingText').text('Error while Sending');
      console.log(result);
    }
  });
}

