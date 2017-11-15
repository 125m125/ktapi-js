import KtApi from './core.js';

KtApi.prototype.getMessages = function (callback) {
    return this.performRequest("GET", "tsv", "users/{user}/messages", null, null, true, callback);
};