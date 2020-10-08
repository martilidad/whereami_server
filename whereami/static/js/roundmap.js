//
// End of round map
//

var roundBounds;
function rminitialize() {
  roundBounds = new google.maps.LatLngBounds();
  var location = window.loc;
  console.log('End of round called');

  //
  // If locLatLongs or guessLatLongs are undefined, they didn't make a guess and there is no
  // round map for people who run out of time, so don't show it at all
  //
  var actualLtLng = new google.maps.LatLng(location['Lat'], location['Long']);
  //use guess array because it might be timeout
  var guessLtLng = new google.maps.LatLng(window.guessArray[0], window.guessArray[1]);
  roundBounds.extend(guessLtLng);
  roundBounds.extend(actualLtLng);

  var mapOptions = {
    zoom: 2,
    center: actualLtLng,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map($('#roundMap')[0], mapOptions);
  window.map = map;

  var actualMarker = new google.maps.Marker({
    position: actualLtLng,
    title: "Actual Location",
    icon: '/static/img/actual.png'
  });

  var guessMarker = new google.maps.Marker({
    position: guessLtLng,
    title: "Your Guess(not on Server)",
    icon: '/static/img/guess.png'
  });

  actualMarker.setMap(map);
  guessMarker.setMap(map);
  renderOtherGuesses(map, location);
  const rectangle = new google.maps.Rectangle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.1,
    bounds: boundary_bounds
  });
  rectangle.setMap(map);
}

function renderOtherGuesses() {
  var map = window.map;
  //intermediate static object before I figure out how to get the data
  $.ajax({
      url: "/guess",
      method: "GET",
      data: {
        "Challenge_Location_ID": window.loc['Challenge_Location_ID'],
      },
      success: function (otherGuesses) {
          for (let i = 0; i < otherGuesses.length; i++) {
            var guess = otherGuesses[i];
            var icon = guess['Own'] ? '/static/img/guess.png' :'/static/img/other.png';
            var ltLng = new google.maps.LatLng(guess['Lat'], guess['Long']);
            roundBounds.extend(ltLng);
            var Marker = new google.maps.Marker({
              position: ltLng,
              label: guess['Own'] ? null : guess['Name'],
              icon: icon,
              title: 'Distance: ' + guess['Distance'] + ' Score: ' + guess['Score']
            });
            Marker.setMap(map);
          }
          map.fitBounds(roundBounds);
      },
      error: function (result) {
        console.log(result);
      }
    });
}
