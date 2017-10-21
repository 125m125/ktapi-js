import { default as KtApi } from '../ktapi/core.js';
import Pusher from 'pusher-js';
import './pusherAuth';

KtApi.prototype.pusherSubscribe = function (channelname, callback) {
    if (!this.pusher) {
        var self = this;
        var superCallback = callback;
        this.pusher = new Pusher('25ba65999fadc5a6e290', {
            cluster: 'eu',
            encrypted: true,
            authorizer: function (channel, options) {
                return {
                    authorize: function (socketId, callback) {
                        self.pusherAuthenticate(socketId, channel.name, function (err, data) {
                            if (err) {
                                superCallback(err);
                                return callback(err);
                            }
                            callback(false, JSON.parse(data.authdata));
                        });
                    }
                };
            }
        });
    }
    this.pusher.subscribe(channelname).bind('update', function (data) {
        callback(false, JSON.parse(data));
    });
}

KtApi.prototype.pusherDisconnect = function () {
    if (this.pusher) {
        this.pusher.disconnect();
        this.pusher = null;
    }
}
