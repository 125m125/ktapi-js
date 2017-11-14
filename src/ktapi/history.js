import KtApi from './core.js';

KtApi.prototype.getHistory = function (item, limit, offset, callback) {
    var params;
    item = (typeof item === "string") ? item : item.id;
    offset = offset || 0;
    limit = limit || 30;
    params = {
        "item": item,
        "offset": offset,
        "limit": limit
    };
    return this.performRequest("GET", "tsv", "history/{item}", params, null, false, callback);
};