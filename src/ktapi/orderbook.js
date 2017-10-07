import { default as KtApi } from './core.js';

KtApi.prototype.getOrderbook = function (item, limit, summarize, mode, callback) {
    var params;
    item = (typeof item === "string") ? item : item.id;
    limit = limit || 10;
    mode = mode || "both";
    params = {
        "item": item,
        "limit": limit,
        "mode": mode,
        "summarize": summarize
    };
    this.performRequest("GET", "tsv", "orderbook/{item}", params, null, false, callback);
};