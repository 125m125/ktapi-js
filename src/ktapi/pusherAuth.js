import { default as KtApi } from './core.js';

KtApi.prototype.pusherAuthenticate = function (socket, channel, callback) {
    var params;
    params = {
        "channel_name": channel,
        "socketId": socket
    };
    this.performRequest("POST", "json", "pusher/authenticate", params, null, true, callback);
};