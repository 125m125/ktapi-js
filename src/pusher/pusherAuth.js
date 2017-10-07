import { default as KtApi } from '../ktapi/core.js';

KtApi.prototype.pusherAuthenticate = function (socket, channel, callback) {
    var params;
    params = {
        "user": this.getUserID(), // FIXME 
        "channel_name": channel,
        "socketId": socket
    };
    this.performRequest("POST", "json", "pusher/authenticate?user={user}", params, null, true, callback);
};