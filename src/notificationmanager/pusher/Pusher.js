import { default as NotificationManager } from '../NotificationManager.js';
import { default as PusherApi } from 'pusher-js';

export default function Pusher (ktapi) {
    this.ktapi = ktapi;
    /**
     * Subscribtion handler
     * @param {String} name the channel / name to subscribe to
     * @param {Boolean} selfCreated 
     * @param {Function} callback callback function
     * @param {Boolean} userIdentified if true, it subscribes to private channel
     */
    this.subscribe = function(name, selfCreated, callback, userIdentified) {
        if (!userIdentified) {
            this.pusherSubscribe(name, callback);
        } else {
            this.pusherSubscribe('private-' + ktapi.getUserID() + '_r' + name + (selfCreated ? '.selfCreated' : ''), callback);
        }
    };
}

Pusher.prototype = Object.create(NotificationManager.prototype);

/**
 * Subscribes to pusher based channels
 * @param {String} channelname the channel name to subscribe to
 * @param {Function} callback callback function
 */
Pusher.prototype.pusherSubscribe = function (channelname, callback) {
    if (!this.pusher) {
        var self = this;
        var superCallback = callback;
        this.pusher = new PusherApi('25ba65999fadc5a6e290', {
            cluster: 'eu',
            encrypted: true,
            /**
             * @param {String} channel the channel to authorize
             * @return {Object} created authorizer object with authorization handler
             */
            authorizer: function (channel/*,options*/) {
                return {
                    /**
                     * Authorization handler for given socket id
                     * @param {String} socketId the socket id
                     * @param {Function} callback callback function
                     */
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
    this.pusher.subscribe(channelname).bind('update', function(data) {
        callback(false, JSON.parse(data));
    });
};

/**
 * Authenticates pusher channel for given socket id
 * @param {String} socket the socket id
 * @param {String} channel the channel
 * @param {Function} callback callback function
 */
Pusher.prototype.pusherAuthenticate = function (socket, channel, callback) {
    var params;
    params = {
        "user": this.ktapi.getUserID(), // FIXME 
        "channel_name": channel,
        "socketId": socket
    };
    this.ktapi.performRequest("POST", "json", "pusher/authenticate?user={user}", params, null, true, callback);
};
