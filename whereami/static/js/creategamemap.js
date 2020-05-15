var map;
var webService = new google.maps.StreetViewService();
var overLayEvents = [];
var areaSum = 0;
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
    var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['circle', 'polygon', 'rectangle']
          },
          circleOptions: {
            clickable: false,
            editable: true
          },
          rectangleOptions: {
            clickable: false,
            editable: true
          },
          polygonOptions: {
            clickable: false,
            editable: true
          }
        });
    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
      if (event.type === 'circle' || event.type === 'rectangle' || event.type === 'polygon') { // rectangle polygon circle
        overLayEvents.push(event);
      }
    });

});

function eventContains(event, latLng) {
    switch (event.type) {
        case 'polygon': return google.maps.geometry.poly.containsLocation(latLng, event.overlay);
        case 'circle': return calcCrow(latLng.lat(), latLng.lng(), event.overlay.getCenter().lat(), event.overlay.getCenter().lng()) <= event.overlay.getRadius();
        case 'rectangle': return event.overlay.getBounds().contains(latLng);
        default:
            throw new Error("unkown event, aborting map creation");
    }
}

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

function randomPointFromBounds(bounds) {
    let southWest = bounds.getSouthWest();
    let northEast = bounds.getNorthEast();
    let lngSpan = northEast.lng() - southWest.lng();
    let latSpan = northEast.lat() - southWest.lat();
    return new google.maps.LatLng(
            southWest.lat() + latSpan * Math.random(),
            southWest.lng() + lngSpan * Math.random());
}

function pointFromOverlayEvent(event) {
    switch (event.type) {
        case 'circle':
        case 'polygon':
            //this will only trigger client side stuff, let's just find a point
            for (let i = 0; i < 100; i++) {
                let point = randomPointFromBounds(event.overlay.getBounds());
                if(eventContains(event, point)) {
                    return point;
                }
            }
            console.log("could not find a point for crazy shape, using random point within bounds.");
            return randomPointFromBounds(event.overlay.getBounds());
        case 'rectangle':
            return randomPointFromBounds(event.overlay.getBounds());
        default:
            throw new Error("unkown event, aborting map creation");
    }
}

function randomPoint() {
    let r=Math.random()*areaSum;
    let sum = 0;
    for (let i = 0; i < overLayEvents.length; i++) {
        sum += overLayEvents[i].area;
        if (r <= sum) return pointFromOverlayEvent(overLayEvents[i]);
    }
    //should not happen
    console.log("Choosing random overlay failed, using last overlay for one point.");
    return pointFromOverlayEvent(overLayEvents[overLayEvents.length - 1]);
}


function calculateEventArea(event) {
    switch (event.type) {
        case 'circle':
            event.area = (event.overlay.getRadius()**2) * Math.PI;
            return;
        case 'polygon':
            event.area = google.maps.geometry.spherical.computeArea(event.overlay.getPath());
            return;
        case 'rectangle':
            let bounds = event.overlay.getBounds();
            let southWest = bounds.getSouthWest();
            let northEast = bounds.getNorthEast();
            let lngDist = calcCrow(southWest.lat(), southWest.lng(), southWest.lat(), northEast.lng());
            let latDist = calcCrow(southWest.lat(), northEast.lng(), northEast.lat(), northEast.lng());
            event.area = lngDist*latDist;
            return;
        default:
            throw new Error("unkown event, aborting map creation");
    }
}

async function createGame() {
    // give up after getting 10 duplicate/unusable locations
    var maxIgnores = 10;
    var ignores = 0;
    var quantity = $('#quantity').val();
    var minDist = $('#minDist').val();
    var name = $('#name').val();
    var places = [];
    var checkaround = 500000;
    var allowPhotoSpheres = $('#allowPhotoSpheres').prop('checked');
    //calculate areas; will be used for weighting random choice
    overLayEvents.forEach(calculateEventArea);
    areaSum = overLayEvents.map(event => event.area).reduce((a, b) => a + b);
    if(areaSum == Number.MAX_VALUE || areaSum == Infinity) {
        $('#loadingText').text('Sorry, your shapes are too big.');
        throw new Error("areaSum overflow");
    }
    while (places.length < quantity && ignores <= maxIgnores) {
        let point = randomPoint();
        //synchronus request, wait for api return
        var panoData = await new Promise(function (resolve, reject) {
            webService.getPanorama({
                location: point,
                radius: checkaround,
                source: allowPhotoSpheres ? google.maps.StreetViewSource.DEFAULT : google.maps.StreetViewSource.OUTDOOR,
                preference: google.maps.StreetViewPreference.NEAREST
            }, function (data) {
                resolve(data);
            })
        });
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
                places.push({Lat: latLng.lat(), Long: latLng.lng(), Name: panoData.location.shortDescription});
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

