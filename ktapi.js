/*jslint nomen: true */
/*global d3, jsSHA, global*/
;
(function () {
    "use strict";


    var baseUrl = "https://kt.125m125.de/api/",
        hashType = "SHA-256",
        hmac = function (text, key) {
            var shaObj = new jsSHA(hashType, "TEXT");
            shaObj.setHMACKey(key, "TEXT");
            shaObj.update(text);
            return shaObj.getHMAC("HEX");
        },
        paramsToQuery = function (params) {
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
        performRequest = function (method, type, suburl, params, token, primaryParam, callback) {
            var url;
            if (token) {
                params.timestamp = (new Date()).getTime();
                params.signature = hmac(paramsToQuery(params), token);
            }
            if (method === "GET") {
                url = baseUrl + suburl + "?" + paramsToQuery(params);
                d3[type](url, callback);
            } else {
                if (primaryParam) {
                    url = baseUrl + suburl + "?" + primaryParam + "=" + params[primaryParam];
                    delete params[primaryParam];
                } else {
                    url = baseUrl + suburl;
                }
                d3.request(url).header("Content-Type", "application/x-www-form-urlencoded").post(paramsToQuery(params), callback);
            }
        },
        user,
        kt = {
            setUser: function (uid, tid, tkn) {
                this.user = {
                    "uid": uid,
                    "tid": tid,
                    "tkn": tkn
                };
            },
            getItems: function (callback, user) {
                var params = {};
                user = user || this.user;
                params = {
                    uid: user.uid,
                    tid: user.tid
                };
                performRequest("GET", "csv", "itemlist", params, user.tkn, false, callback);
            },
            getTrades: function (callback, user) {
                var params = {};
                user = user || this.user;
                params = {
                    uid: user.uid,
                    tid: user.tid
                };
                performRequest("GET", "csv", "trades", params, user.tkn, false, callback);
            },
            getHistory: function (item, limit, callback) {
                item = (typeof item === "string") ? item : item.id;
                d3.csv(baseUrl + "history?res=" + item + "&limit=" + limit, callback);
            },
            getPrice: function (item, callback) {
                this.getHistory(item, 1, function (data) {
                    if (data.length > 0) {
                        callback(data[0].close);
                    } else {
                        callback(0);
                    }
                });
            },
            createTrade: function (buyOrSell, item, count, price, callback, user) {
                var params;
                user = user || this.user;
                item = (typeof item === "string") ? item : item.id;
                params = {
                    "create": "create",
                    "bs": (buyOrSell ? "buy" : "sell"),
                    "item": item,
                    "count": count,
                    "price": price,
                    "uid": user.uid,
                    "tid": user.tid
                };
                performRequest("POST", false, "trades", params, user.tkn, "create", callback);
            },
            buy: function (item, count, price, callback, user) {
                this.createTrade(true, item, count, price, callback, user);
            },
            sell: function (item, count, price, callback, user) {
                this.createTrade(false, item, count, price, callback, user);
            },
            cancelTrade: function (trade, callback, user) {
                var params;
                user = user || this.user;
                trade = (typeof trade === "string") ? trade : trade.id;
                params = {
                    "cancel": "cancel",
                    "tradeid": trade,
                    "uid": user.uid,
                    "tid": user.tid
                };
                performRequest("POST", false, "trades", params, user.tkn, "cancel", callback);
            },
            takeout: function (trade, callback, user) {
                var params;
                user = user || this.user;
                trade = (typeof trade === "string") ? trade : trade.id;
                params = {
                    "takeout": "takeout",
                    "tradeid": trade,
                    "uid": user.uid,
                    "tid": user.tid
                };
                performRequest("POST", false, "trades", params, user.tkn, "takeout", callback);
            }

        };
    window.kt = kt;
}());