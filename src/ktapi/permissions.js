import { default as KtApi } from './core.js';

KtApi.prototype.getPermissions = function (callback) {
    this.performRequest("GET", "json", "permissions/{user}", null, null, true, callback);
};