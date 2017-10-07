import { default as KtApi } from './core.js';

KtApi.prototype.getMessages = function (callback) {
    this.performRequest("GET", "tsv", "users/{user}/messages", null, null, true, callback);
};