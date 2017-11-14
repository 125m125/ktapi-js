import KtApi from './core.js';

KtApi.prototype.getTrades = function (callback) {
    return this.performRequest("GET", "tsv", "users/{user}/orders", null, null, true, callback);
};

KtApi.prototype.createTrade = function (buyOrSell, item, count, price, callback) {
    var params;
    item = (typeof item === "string") ? item : item.id;
    params = {
        "buySell": (buyOrSell ? "BUY" : "SELL"),
        "item": item,
        "amount": count,
        "price": price
    };
    return this.performRequest("POST", "json", "users/{user}/orders", params, null, true, callback);
};

KtApi.prototype.buy = function (item, count, price, callback) {
    return this.createTrade(true, item, count, price, callback);
};

KtApi.prototype.sell = function (item, count, price, callback) {
    return this.createTrade(false, item, count, price, callback);
};

KtApi.prototype.cancelTrade = function (trade, callback) {
    var params;
    trade = (typeof trade === "string") ? trade : trade.id;
    params = {
        "orderId": trade
    };
    return this.performRequest("POST", "json", "users/{user}/orders/{orderId}/cancel", params, null, true, callback);
};

KtApi.prototype.takeoutTrade = function (trade, callback) {
    var params;
    trade = (typeof trade === "string") ? trade : trade.id;
    params = {
        "orderId": trade
    };
    return this.performRequest("POST", "json", "users/{user}/orders/{orderId}/takeout", params, null, true, callback);
};