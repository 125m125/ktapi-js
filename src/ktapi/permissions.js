import KtApi from './core.js';

KtApi.prototype.getPermissions = function (callback) {
    return this.performRequest("GET", "json", "permissions/{user}", null, null, true, callback);
};