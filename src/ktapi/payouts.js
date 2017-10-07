import { default as KtApi } from './core.js';

KtApi.prototype.getPayouts = function (callback) {
    this.performRequest("GET", "tsv", "users/{user}/payouts", null, null, true, callback);
};

KtApi.prototype.createPayout = function (type, item, count, callback) {
    var params;
    item = (typeof item === "string") ? item : item.id;
    params = {
        "type": type,
        "item": item,
        "amount": count
    };
    this.performRequest("POST", "json", "users/{user}/payouts", params, null, true, callback);
};

KtApi.prototype.cancelPayout = function (payout, callback) {
    var params;
    payout = (typeof payout === "string") ? payout : payout.id;
    params = {
        "payoutid": payout
    };
    this.performRequest("POST", "json", "users/{user}/payouts/cancel", params, null, true, callback);
};

KtApi.prototype.takeoutPayout = function (payout, callback) {
    var params;
    payout = (typeof payout === "string") ? payout : payout.id;
    params = {
        "payoutid": payout
    };
    this.performRequest("POST", "json", "users/{user}/payouts/takeout", params, null, true, callback);
};