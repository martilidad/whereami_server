//
// Minimap
//
function CenterTimer(controlDiv) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Time left';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.id = "centerTimer";
        controlText.innerHTML = "timer";
        // controlText.id = "timer";
        controlUI.appendChild(controlText);
}

function mminitialize() {

  var guessMarker;

  // Mini map setup
  var mapOptions = {
    center: new google.maps.LatLng(0, 0, true),
    zoom: 1,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };


  var centerControlDiv = document.createElement('div');
  new CenterTimer(centerControlDiv);
  centerControlDiv.index = 1;
  var mMap = new google.maps.Map(document.getElementById('miniMap'), mapOptions);
  mMap.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

  // Marker selection setup
  var guessMarkerOptions = new google.maps.Marker({
    map: mMap,
    visible: true,
    title: 'Your guess',
    draggable: false
    //icon: '/img/googleMapsMarkers/red_MarkerB.png'
  });

  // Mini map marker setup
  function setGuessMarker(guess) {
    if (guessMarker) {
      guessMarker.setPosition(guess);
    } else {
      guessMarker = new google.maps.Marker(guessMarkerOptions);
      guessMarker.setPosition(guess);
    }
  }

  // Mini map click
  google.maps.event.addListener(mMap, 'click', function (event) {
    window.guessLatLng = event.latLng;
    game.timedOut = false;
    setGuessMarker(window.guessLatLng);
  });

};
