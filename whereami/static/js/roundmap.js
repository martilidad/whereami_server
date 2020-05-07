//
// End of round map
//

function rminitialize() {
  var location = window.loc;
  console.log('End of round called');

  //
  // If locLatLongs or guessLatLongs are undefined, they didn't make a guess and there is no
  // round map for people who run out of time, so don't show it at all
  //
  var actualLtLng = new google.maps.LatLng(location['Lat'], location['Long']);
  //use guess array because it might be timeout
  var guessLtLng = new google.maps.LatLng(window.guessArray[0], window.guessArray[1]);

  var mapOptions = {
    zoom: 2,
    center: actualLtLng,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  var map = new google.maps.Map($('#roundMap')[0], mapOptions);
  window.map = map;

  var actualMarker = new google.maps.Marker({
    position: actualLtLng,
    title: "Actual Location",
    icon: 'img/actual.png'
  });

  var guessMarker = new google.maps.Marker({
    position: guessLtLng,
    title: "Your Guess",
    icon: 'img/guess.png'
  });

  actualMarker.setMap(map);
  guessMarker.setMap(map);
  renderOtherGuesses(map, location);
};

function renderOtherGuesses() {
  var map = window.map;
  //intermediate static object before I figure out how to get the data
  $.ajax({
      url: "http://" + window.location.host + "/guess",
      method: "GET",
      data: {
        "Challenge_Location_ID": window.loc['Challenge_Location_ID'],
      },
      success: function (otherGuesses) {
          for (let i = 0; i < otherGuesses.length; i++) {
            var guess = otherGuesses[i];
            var ltLng = new google.maps.LatLng(guess['Lat'], guess['Long']);
            var Marker = new google.maps.Marker({
              position: ltLng,
              label: guess['Name'],
              icon: 'img/other.png',
              title: 'Distance: ' + guess['Distance'] + ' Score: ' + guess['Score']
            });
            Marker.setMap(map);
          }
      },
      error: function (result) {
        console.log(result);
      }
    });
}
