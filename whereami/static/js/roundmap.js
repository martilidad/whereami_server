const INTERACT_GRACE_PERIOD = 2000;
var lastInteraction = 0;

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
  map.addListener("bounds_changed", () => { 
    lastInteraction = new Date().getTime();
  });
  window.map = map;

  var actualMarker = new google.maps.Marker({
    position: actualLtLng,
    title: "Actual Location",
    label: "Target",
    icon: '/static/img/red_marker.png'
  });

  var guessMarker = new google.maps.Marker({
    position: guessLtLng,
    title: "Your Guess(not on Server)",
    label: "You",
    icon: '/static/img/green_marker.png'
  });

  actualMarker.setMap(map);
  guessMarker.setMap(map);
  markerCount = 0;
  renderOtherGuesses();
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

var markerCount = 0;

function renderOtherGuesses(forceFit = false) {
  var map = window.map;
  $.ajax({
      url: "/guess",
      method: "GET",
      data: {
        "Challenge_Location_ID": window.loc['Challenge_Location_ID'],
      },
      success: function (otherGuesses) {
          for (let i = 0; i < otherGuesses.length; i++) {
            var guess = otherGuesses[i];
            var icon = guess['Own'] ? '/static/img/green_marker.png' :'/static/img/orange_marker.png';
            var ltLng = new google.maps.LatLng(guess['Lat'], guess['Long']);
            roundBounds.extend(ltLng);
            var Marker = new google.maps.Marker({
              position: ltLng,
              label: guess['Own'] ? "You" : guess['Name'],
              icon: icon,
              title: 'Distance: ' + guess['Distance'] + ' Score: ' + guess['Score']
            });
            Marker.setMap(map);
          }
          if (forceFit || otherGuesses.length > markerCount) {
            if(forceFit || lastInteraction + INTERACT_GRACE_PERIOD < new Date().getTime()) {
              //copy by value
              var interaction = lastInteraction.getValue();
              //lastinteraction listener can't differentiate system events
              map.fitBounds(roundBounds);
              lastInteraction = interaction;
            }
            markerCount = otherGuesses.length
          }
      },
      error: function (result) {
        console.log(result);
      }
    });
}
