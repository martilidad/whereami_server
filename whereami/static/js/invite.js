const inviteLink = location;
$('#start').prop("href", "/startChallenge" + location.search);

function invite() {
    let temp_raw = $("<input>");
    $("body").append(temp_raw);
    temp_raw.val(inviteLink);
    temp_raw.select();
    console.log(document.execCommand("copy"));
    temp_raw.remove();
}

$('#autoStart').prop('checked', JSON.parse(localStorage.getItem('autostart')));
$('#autoStart').change(function () {
    localStorage.setItem('autostart', this.checked);
});

//shared web socket worker for this challenge
var sharedWorker = new SharedWorker('/static/js/challengeStatusWorker.js' + location.search);
sharedWorker.port.onmessage = function (e) {
    var data = JSON.parse(e.data);
    var usersHere = data.filter(user => user.status == 'invite_screen').map(user => user.username);
    var otherUsers = data.filter(user => user.status != 'invite_screen').map(user => user.username);
    $('#inviteStatusDiv').text(`There are ${usersHere.length} Users waiting here: ${usersHere.toString()}`);
    $('#userStatusDiv').text(`There are ${otherUsers.length} Users playing or finished: ${otherUsers.toString()}`);
    console.log('Message received from worker:' + e.data);
    if ($('#autoStart').prop('checked') && data.some(user => user.status == 'playing' && user.round == 0)) {
        location = "/startChallenge" + location.search;
    }
};
sharedWorker.port.postMessage({'status': 'invite_screen', round: -1});
$(document).ready(function () {

    const map = new google.maps.Map(document.getElementById('previewMap'), {
        zoom: 11,
        center: {lat: 33.678, lng: -116.243}
    });
    var bounds = new google.maps.LatLngBounds();
    boundary_array.forEach(coord => bounds.extend(new google.maps.LatLng(coord.Lat, coord.Long)));
    map.fitBounds(bounds);
    const rectangle = new google.maps.Rectangle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.1,
        map,
        bounds: bounds
    });

});


