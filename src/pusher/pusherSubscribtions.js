import { default as KtApi } from '../ktapi/core.js';
import './pusherCore';

function subscribe(ktapi, name, selfCreated, callback) {
    ktapi.pusherSubscribe('private-' + ktapi.getUserID() + '_r' + name + (selfCreated ? '.selfCreated' : ''), callback);
}

KtApi.prototype.subscribeItems = function (callback, selfCreated) {
    subscribe(this, 'Items', selfCreated, callback);
};
KtApi.prototype.subscribeOrders = function (callback, selfCreated) {
    subscribe(this, 'Orders', selfCreated, callback);
};
KtApi.prototype.subscribePayouts = function (callback, selfCreated) {
    subscribe(this, 'Payouts', selfCreated, callback);
};
KtApi.prototype.subscribeMessages = function (callback, selfCreated) {
    subscribe(this, 'Messages', selfCreated, callback);
};
KtApi.prototype.subscribeOrderbook = function (callback) {
    this.pusherSubscribe('order', callback);
};
KtApi.prototype.subscribeHistory = function (callback) {
    this.pusherSubscribe('history', callback);
};