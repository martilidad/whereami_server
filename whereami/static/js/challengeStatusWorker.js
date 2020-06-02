onconnect = function (e) {
    var port = e.ports[0];
    let urlSearchParams = new URLSearchParams(location.search);
    let prefix = location.protocol == "https:" ? "wss://" : "ws://";
    var url = prefix + location.hostname + "/ws/challenge/" + urlSearchParams.get('Challenge_ID') + "/";
    var sync_time = 0;
    var status_dict = {};
    var my_status = null;
    var timeout = null;

    var ws = new WebSocket(url);
    ws.onmessage = function (event) {
        console.log('Message from server ', event.data);
        var data = JSON.parse(event.data);
        if (data.type === 'resync' && data.sync_time > sync_time) {
            sync_time = data.sync_time;
            status_dict = {};
            sendStatusIfPossible();
        }
        if (data.type === 'client_update' && data.sync_time == sync_time) {
            status_dict[data.id] = {
                'username': data.username,
                'status': data.user_data.status,
                'round': data.user_data.round
            };


            // wait a little before updating page, maybe more updates are still comming
            clearTimeout(timeout);
            timeout = setTimeout(sendStatusListToPage, 500);
        }
    };

    function sendStatusListToPage() {
        var arr = [];
        for (var key in status_dict) {
            if (status_dict.hasOwnProperty(key)) {
                arr.push(status_dict[key]);
            }
        }
        port.postMessage(JSON.stringify(arr));
    }

    function sendStatusIfPossible() {
        //is already open?
        if (ws.readyState == 1 && my_status != null) {
            ws.send(JSON.stringify({'data': my_status, 'sync_time': sync_time}));
        }
    }

    port.onmessage = function (e) {
        my_status = e.data;
        sendStatusIfPossible();
    };
}
