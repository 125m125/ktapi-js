import { default as KtApi } from './core.js';

KtApi.prototype.getItems = function (callback) {
    this.performRequest("GET", "tsv", "users/{user}/items", null, null, true, callback);
};
KtApi.prototype.getItem = function (item, callback) {
    this.performRequest("GET", "tsv", "users/{user}/items/{item}", {
        "item": (typeof item === "string") ? item : item.id
    }, null, true, callback);
};