/*jslint nomen: true */
/*global d3, jsSHA, global*/
;
(function () {
    "use strict";


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
            var url;
            if (method === "GET") {
                url = baseUrl + suburl + "?" + paramsToQuery(params);
                params = null;
            } else {
                url = baseUrl + suburl;
                if (!headers["Content-Type"]) {
                    headers["Content-Type"] = "application/x-www-form-urlencoded";
                }
            }
            var request = d3[type](url);
            Object.keys(headers).forEach(function (key) { request.header(key, headers[key]) });
            request.on("error", function (error) {
                var errorTarget = error.target;
                try {
                    return callback(JSON.parse(errorTarget.response));
                } catch (e) {
                }
                callback(errorTarget);
            }).on("load", function (data) { callback(false, data) });
            request.send(method, paramsToQuery(params));
        };
    function HmacAuthenticator() {
        this.maxSignatureOffset = 4 * 60 * 1000;
        this.hashType = "SHA-256",
            this.dTime = 0;
        var last = 0;
        this.authenticate = function (method, type, suburl, params, headers, user) {
            params.tid = user.tid;
            if (last) {
                if (last < new Date().getTime() - this.maxSignatureOffset) {
                    last = new Date().getTime() + this.maxSignatureOffset;
                }
                params.timestamp = last + this.dTime;
            } else {
                params.timestamp = (new Date()).getTime() + this.dTime;
            }
            params.signature = this.hmac(paramsToQuery(params), user.tkn, this.hashType);
        }
    }
    HmacAuthenticator.prototype.hmac = function (text, key, hashType) {
        var shaObj = new jsSHA(hashType, "TEXT");
        shaObj.setHMACKey(key, "TEXT");
        shaObj.update(text);
        return shaObj.getHMAC("HEX");
    }

    function Request(method, type, suburl, params, headers, user, authenticator) {
        this.execute = function (callback) {
            if (!params) {
                params = {};
            }
            if (!headers) {
                headers = {};
            }
            suburl = suburl.replace(/{.*?}/g, function (key) {
                if (key === "{user}") {
                    return user.uid;
                }
                var key2 = key.substring(1, key.length - 1);
                if (params.hasOwnProperty(key2) && params[key2] !== undefined) {
                    var result = params[key2];
                    delete params[key2];
                    return result;
                }
                return key
            });
            if (authenticator) {
                authenticator.authenticate(method, type, suburl, params, headers, user);
            }
            performRequest(method, type, suburl, params, headers, callback);
        }
    }

    function Kt(uid, tid, tkn, authenticator) {
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
        if (!authenticator) {
            authenticator = new HmacAuthenticator();
        }
        this.getRequest = function (method, type, suburl, params, headers, auth) {
            var requestAuthenticator;
            if (auth) {
                requestAuthenticator = authenticator;
            }
            return new Request(method, type, suburl, params, headers, user, requestAuthenticator);
        }
        this.performRequest = function (method, type, suburl, params, headers, auth, callback) {
            return this.getRequest(method, type, suburl, params, headers, auth).execute(callback);
        }
    }
    Kt.prototype.getItems = function (callback) {
        this.performRequest("GET", "tsv", "users/{user}/items", null, null, true, callback);
    };
    Kt.prototype.getItem = function (item, callback) {
        this.performRequest("GET", "tsv", "users/{user}/items/{item}", { "item": (typeof item === "string") ? item : item.id }, null, true, callback);
    };
    Kt.prototype.getTrades = function (callback) {
        this.performRequest("GET", "tsv", "users/{user}/orders", null, null, true, callback);
    };

    Kt.prototype.createTrade = function (buyOrSell, item, count, price, callback) {
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

    Kt.prototype.buy = function (item, count, price, callback) {
        this.createTrade(true, item, count, price, callback);
    };

    Kt.prototype.sell = function (item, count, price, callback) {
        this.createTrade(false, item, count, price, callback);
    };

    Kt.prototype.cancelTrade = function (trade, callback) {
        var params;
        trade = (typeof trade === "string") ? trade : trade.id;
        params = {
            "orderId": trade
        };
        this.performRequest("POST", "json", "users/{user}/orders/{orderId}/cancel", params, null, true, callback);
    };

    Kt.prototype.takeoutTrade = function (trade, callback) {
        var params;
        trade = (typeof trade === "string") ? trade : trade.id;
        params = {
            "orderId": trade
        };
        this.performRequest("POST", "json", "users/{user}/orders/{orderId}/takeout", params, null, true, callback);
    };

    Kt.prototype.pusherAuthenticate = function (socket, channel) {
        var params;
        params = {
            "channel_name": channel,
            "socketId": socket
        };
        this.performRequest("POST", "json", "pusher/authenticate", params, null, true, callback);
    }

    Kt.prototype.getPayouts = function (callback) {
        performRequest("GET", "tsv", "users/{user}/payouts", null, null, true, callback);
    };

    Kt.prototype.createPayout = function (type, item, count, callback) {
        var params;
        item = (typeof item === "string") ? item : item.id;
        params = {
            "type": type,
            "item": item,
            "amount": amount
        };
        this.performRequest("POST", "json", "users/{user}/payouts", params, null, true, callback);
    };

    Kt.prototype.cancelPayout = function (payout, callback) {
        var params;
        payout = (typeof payout === "string") ? payout : payout.id;
        params = {
            "payoutid": payout
        };
        this.performRequest("POST", "json", "users/{user}/payouts/cancel", params, null, true, callback);
    };

    Kt.prototype.takeoutPayout = function (payout, callback) {
        var params;
        payout = (typeof payout === "string") ? payout : payout.id;
        params = {
            "payoutid": payout
        };
        this.performRequest("POST", "json", "users/{user}/payouts/takeout", params, null, true, callback);
    };

    Kt.prototype.getMessages = function (callback) {
        this.performRequest("GET", "tsv", "users/{user}/messages", null, null, true, callback);
    };

    Kt.prototype.getPermissions = function(callback) {
        this.performRequest("GET", "json", "permissions/{user}", null, null, true, callback);
    }

    Kt.prototype.getHistory = function(item, limit, offset, callback) {
        var params;
        item = (typeof item === "string") ? item : item.id;
        offset = offset || 0;
        limit = limit || 30;
        params = {
            "item": item,
            "offset": offset,
            "limit": limit
        }
        this.performRequest("GET", "tsv", "history/{item}", params, null, false, callback);
    }

    Kt.prototype.getOrderbook = function(item, limit, summarize, mode, callback) {
        var params;
        item = (typeof item === "string") ? item : item.id;
        limit = limit || 10;
        mode = mode || "both";
        params = {
            "item": item,
            "limit": limit,
            "mode": mode,
            "summarize": summarize
        }
        this.performRequest("GET", "tsv", "orderbook/{item}", params, null, false, callback);
    }
    
    window.Kt = Kt;
    window.KtAuthenticators = {
        HmacAuthenticator: HmacAuthenticator
    }
}());