const worldBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(70.4043,-143.5291),	//Top-left
    new google.maps.LatLng(-46.11251, 163.4288)	 //Bottom-right
);
var map;
var pano;
var activeMarker;
var handpickedMarkers = [];
var webService = new google.maps.StreetViewService();
var overLayEvents = [];
var areaSum = 0;
var coverageLayer;
var drawingManager;
var changed = false;

if (!google.maps.Polygon.prototype.getBounds) {
    google.maps.Polygon.prototype.getBounds = function () {
        var bounds = new google.maps.LatLngBounds();
        this.getPath().forEach(function (element, index) { bounds.extend(element); });
        return bounds;
    }
}

function toggleCl() {
    if(coverageLayer == null) {
        coverageLayer = new google.maps.StreetViewCoverageLayer();
    }
    coverageLayer.setMap(coverageLayer.getMap() == null ? map : null);
}

function CoverageToggle(controlDiv) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Toggle the Streetview Coverage Layer';
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
        controlText.innerHTML = "Toggle Coverage";

        controlUI.appendChild(controlText);
        controlUI.addEventListener('click', toggleCl);
}

$(document).ready(function () {
    // Mini map setup
    var mapOptions = {
        center: new google.maps.LatLng(0, 0, true),
        zoom: 1,
        mapTypeControl: false,
        streetViewControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    pano = new google.maps.StreetViewPanorama(document.getElementById("pano"));
    pano.setVisible(true)
    $("#createGamePano").hide()
    map = new google.maps.Map(document.getElementById('createGameMap'), mapOptions);
    map.fitBounds(worldBounds);

    var centerControlDiv = document.createElement('div');
    new CoverageToggle(centerControlDiv);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(centerControlDiv);

    drawingManager = new google.maps.drawing.DrawingManager({
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
          changed = true;
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
    var maxIgnores = 1000;
    var ignores = 0;
    var quantity = $('#quantity').val();
    var minDist = $('#minDist').val();
    var name = $('#name').val();
    var places = [];
    var checkaround = 10000;
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
                preference: google.maps.StreetViewPreference.BEST
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
            changed = false;
        },
        error: function (result) {
            $('#loadingText').text('Error while Sending');
            console.log(result);
        }
    });
}

function clearDrawings() {
    for (var i=0; i < overLayEvents.length; i++) {
        overLayEvents[i].overlay.setMap(null);
    }
    overLayEvents = [];
    changed = false;
}

function toggleMode(handpicked) {
    const activeButton = handpicked ? $("#handPickedButton") : $("#areaButton");
    const inactiveButton = handpicked ? $("#areaButton") : $("#handPickedButton");
    activeButton.addClass("btn-primary");
    activeButton.removeClass("btn-secondary");
    inactiveButton.addClass("btn-secondary");
    inactiveButton.removeClass("btn-primary");
    if(handpicked) {
        $("#areaForm").hide();
        $("#handpickedForm").show();
        if (activeMarker != null) $("#createGamePano").show();
        map.addListener("click", (event) => {
            changed = true;
            const radius = 50000/Math.pow(1.6, map.getZoom());
            webService.getPanorama({ location: event.latLng, radius:radius }, processPano);
        });
    } else {
        $("#areaForm").show();
        $("#handpickedForm").hide();
        $("#createGamePano").hide();
        google.maps.event.clearListeners(map, 'click');
    }
    const cursor = handpicked ? 'crosshair' : null;
    map.setOptions({draggableCursor: cursor});
    drawingManager.setMap(handpicked ? null : map);
    for (let i=0; i < handpickedMarkers.length; i++) {
        handpickedMarkers[i].setMap(handpicked ? map : null);
    }
    for (let i=0; i < overLayEvents.length; i++) {
        overLayEvents[i].overlay.setMap(handpicked ? null : map);
    }
}

function processPano(data, status) {
    $('#infoText').text("");
    if (status === "OK") {
        const location = data.location;
        const marker = new google.maps.Marker({
            position: location.latLng,
            map,
            title: location.description,
            draggable: true,
        });
        handpickedMarkers.push(marker);
        activateMarker(marker);
        marker.addListener("click", activateMarkerCallback);
        marker.addListener("dragstart", startDrag)
        marker.addListener("dragend", () => {
            const radius = 50000/Math.pow(1.4, map.getZoom());
            webService.getPanorama({ location: marker.getPosition(), radius:radius }, moveMarker);
        });
        $("#locationCount").text(handpickedMarkers.length);
    } else {
        $('#infoText').text("no Street view for this area");
    }
}

let dragStartPos;

function startDrag() {
    activateMarker(this);
    dragStartPos = this.getPosition();
}

function moveMarker(data, status) {
    $('#infoText').text("");
    if (status === "OK") {
        const pos = data.location.latLng;
        activeMarker.setPosition(pos);
        pano.setPosition(pos);
    } else {
        activeMarker.setPosition(dragStartPos);
        $('#infoText').text("no street view found for dragged area");
    }
}

function activateMarkerCallback() {
    activateMarker(this);
}

function activateMarker(marker) {
    if (activeMarker != null) {
        activeMarker.setIcon({
            url: "/static/img/marker.png",
            scaledSize: new google.maps.Size(27, 43)
        });
    }
    marker.setIcon(null);
    google.maps.event.clearListeners(pano, "position_changed");
    activeMarker = marker;
    pano.setPosition(marker.getPosition());
    pano.addListener("position_changed", () => {
        marker.setPosition(pano.getPosition());
    });
    $("#createGamePano").show()
}

function focusMarker() {
    if (activeMarker != null) {
        map.panTo(activeMarker.getPosition());
        map.setZoom(12);
    }
}

function deleteMarker() {
    if (activeMarker != null) {
        activeMarker.setMap(null);
        const index = handpickedMarkers.indexOf(activeMarker);
        if (index > -1) {
            handpickedMarkers.splice(index, 1);
        }
        activeMarker = null;
        $("#createGamePano").hide()
        $("#locationCount").text(handpickedMarkers.length);
    }
}

function createHandpickedGame() {
    const places = [];
    for (let i=0; i < handpickedMarkers.length; i++) {
        const latLng = handpickedMarkers[i].getPosition();
        places.push({Lat: latLng.lat(), Long: latLng.lng(), Name: handpickedMarkers[i].getTitle()});
    }
    const name = $('#handpickedName').val();
    $('#infoText').text('Sending to Server, this can take some time.');
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
            $('#infoText').text('Success');
            changed = false;
        },
        error: function (result) {
            $('#infoText').text('Error while Sending');
            console.log(result);
        }
    });
}

function cancelCreation() {
    if (changed) {
        $('#cancelConfirmationModal').modal('show');
    } else {
        location.href = "/";
    }
}
