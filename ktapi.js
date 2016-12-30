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
        };

    function Kt(uid, tid, tkn) {
        var user = {
            "uid": uid,
            "tid": tid,
            "tkn": tkn
        };
        this.getItems = function (callback) {
            var params = {};
            params = {
                uid: user.uid,
                tid: user.tid
            };
            performRequest("GET", "csv", "itemlist", params, user.tkn, false, callback);
        };
        this.getTrades = function (callback) {
            var params = {};
            params = {
                uid: user.uid,
                tid: user.tid
            };
            performRequest("GET", "csv", "trades", params, user.tkn, false, callback);
        };
        this.getHistory = function (item, limit, callback) {
            item = (typeof item === "string") ? item : item.id;
            d3.csv(baseUrl + "history?res=" + item + "&limit=" + limit, callback);
        };
        this.getPrice = function (item, callback) {
            this.getHistory(item, 1, function (data) {
                if (data.length > 0) {
                    callback(data[0].close);
                } else {
                    callback(0);
                }
            });
        };
        this.createTrade = function (buyOrSell, item, count, price, callback) {
            var params;
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
        };
        this.buy = function (item, count, price, callback) {
            this.createTrade(true, item, count, price, callback);
        };
        this.sell = function (item, count, price, callback) {
            this.createTrade(false, item, count, price, callback);
        };
        this.cancelTrade = function (trade, callback) {
            var params;
            trade = (typeof trade === "string") ? trade : trade.id;
            params = {
                "cancel": "cancel",
                "tradeid": trade,
                "uid": user.uid,
                "tid": user.tid
            };
            performRequest("POST", false, "trades", params, user.tkn, "cancel", callback);
        };
        this.takeout = function (trade, callback) {
            var params;
            trade = (typeof trade === "string") ? trade : trade.id;
            params = {
                "takeout": "takeout",
                "tradeid": trade,
                "uid": user.uid,
                "tid": user.tid
            };
            performRequest("POST", false, "trades", params, user.tkn, "takeout", callback);
        };
    }
    window.Kt = Kt;
}());