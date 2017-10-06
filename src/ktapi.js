var baseUrl = "https://kt.125m125.de/api/v2.0/",
    paramsToQuery = function (params) {
        if (!params) {
            return params;
        }
        var result = "",
            sorted_keys = Object.keys(params).sort();
        sorted_keys.forEach(function (entry) {
            result += entry + "=" + params[entry] + "&";
        });
        if (result.length) {
            return result.slice(0, -1);
        }
        return result;
    },
    performRequest = function (method, type, suburl, params, headers, callback) {
        var url, request;
        if (method === "GET") {
            url = baseUrl + suburl + "?" + paramsToQuery(params);
            params = null;
        } else {
            url = baseUrl + suburl;
            if (!headers["Content-Type"]) {
                headers["Content-Type"] = "application/x-www-form-urlencoded";
            }
        }
        request = d3[type](url);
        Object.keys(headers).forEach(function (key) {
            request.header(key, headers[key]);
        });
        request.on("error", function (error) {
            var errorTarget = error.target;
            try {
                return callback(JSON.parse(errorTarget.response));
            } catch (e) { }
            callback(errorTarget);
        }).on("load", function (data) {
            callback(false, data);
        });
        request.send(method, paramsToQuery(params));
    };

function Request(method, type, suburl, params, headers, user, authenticator) {
    this.execute = function (callback) {
        if (!params) {
            params = {};
        }
        if (!headers) {
            headers = {};
        }
        suburl = suburl.replace(/\{[a-zA-Z0-9]+?\}/g, function (key) {
            if (key === "{user}") {
                return user.uid;
            }
            var key2 = key.substring(1, key.length - 1),
                result;
            if (params.hasOwnProperty(key2) && params[key2] !== undefined) {
                result = params[key2];
                delete params[key2];
                return result;
            }
            return key;
        });
        if (authenticator) {
            authenticator.authenticate(method, type, suburl, params, headers, user);
        }
        performRequest(method, type, suburl, params, headers, callback);
    };
}

var KtApi = function (uid, tid, tkn, authenticator) {
    var user = {
        "uid": uid,
        "tid": tid,
        "tkn": tkn
    },
        permissions;

    this.getPermissions = function (callback) {
        var start = new Date();
        performRequest("GET", "json", "permissions", {
            uid: user.uid,
            tid: user.tid
        }, user.tkn, false, callback);
    };
    this.getRequest = function (method, type, suburl, params, headers, auth) {
        var requestAuthenticator;
        if (auth) {
            requestAuthenticator = authenticator;
        }
        return new Request(method, type, suburl, params, headers, user, requestAuthenticator);
    };
    this.performRequest = function (method, type, suburl, params, headers, auth, callback) {
        return this.getRequest(method, type, suburl, params, headers, auth).execute(callback);
    };
}
KtApi.prototype.getItems = function (callback) {
    this.performRequest("GET", "tsv", "users/{user}/items", null, null, true, callback);
};
KtApi.prototype.getItem = function (item, callback) {
    this.performRequest("GET", "tsv", "users/{user}/items/{item}", {
        "item": (typeof item === "string") ? item : item.id
    }, null, true, callback);
};
KtApi.prototype.getTrades = function (callback) {
    this.performRequest("GET", "tsv", "users/{user}/orders", null, null, true, callback);
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
    this.performRequest("POST", "json", "users/{user}/orders", params, null, true, callback);
};

KtApi.prototype.buy = function (item, count, price, callback) {
    this.createTrade(true, item, count, price, callback);
};

KtApi.prototype.sell = function (item, count, price, callback) {
    this.createTrade(false, item, count, price, callback);
};

KtApi.prototype.cancelTrade = function (trade, callback) {
    var params;
    trade = (typeof trade === "string") ? trade : trade.id;
    params = {
        "orderId": trade
    };
    this.performRequest("POST", "json", "users/{user}/orders/{orderId}/cancel", params, null, true, callback);
};

KtApi.prototype.takeoutTrade = function (trade, callback) {
    var params;
    trade = (typeof trade === "string") ? trade : trade.id;
    params = {
        "orderId": trade
    };
    this.performRequest("POST", "json", "users/{user}/orders/{orderId}/takeout", params, null, true, callback);
};

KtApi.prototype.pusherAuthenticate = function (socket, channel, callback) {
    var params;
    params = {
        "channel_name": channel,
        "socketId": socket
    };
    this.performRequest("POST", "json", "pusher/authenticate", params, null, true, callback);
};

KtApi.prototype.getPayouts = function (callback) {
    performRequest("GET", "tsv", "users/{user}/payouts", null, null, true, callback);
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

KtApi.prototype.getMessages = function (callback) {
    this.performRequest("GET", "tsv", "users/{user}/messages", null, null, true, callback);
};

KtApi.prototype.getPermissions = function (callback) {
    this.performRequest("GET", "json", "permissions/{user}", null, null, true, callback);
};

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
    this.performRequest("GET", "tsv", "history/{item}", params, null, false, callback);
};

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
export { KtApi };
