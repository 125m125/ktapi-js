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
                var timestamp = (new Date()).getTime(),
                    url = baseUrl + "itemlist",
                    params;
                user = user || this.user;
                params = "tid=" + user.tid + "&timestamp=" + timestamp + "&uid=" + user.uid;
                url += "?" + params + "&signature=" + hmac(params, user.tkn);
                d3.csv(url, callback);
            },
            getTrades: function (callback, user) {
                var timestamp = (new Date()).getTime(),
                    url = baseUrl + "trades",
                    params;
                user = user || this.user;
                params = "tid=" + user.tid + "&timestamp=" + timestamp + "&uid=" + user.uid;
                url += "?" + params + "&signature=" + hmac(params, user.tkn);
                d3.csv(url, callback);
            },
            getPrice: function (item, callback) {
                item = (typeof item === "string") ? item : item.id;
                d3.csv(baseUrl + "history?res=" + item + "&limit=1", function (data) {
                    if (data.length > 0) {
                        callback(data[0].close);
                    } else {
                        callback(0);
                    }
                });
            },
            getHistory: function (item, limit, callback) {
                item = (typeof item === "string") ? item : item.id;
                d3.csv(baseUrl + "history?res=" + item + "&limit=" + limit, function (data) {
                    if (data.length > 0) {
                        callback(data[0].close);
                    } else {
                        callback(0);
                    }
                });
            },
            createTrade: function (buyOrSell, item, count, price, callback, user) {
                var timestamp = (new Date()).getTime(),
                    url = baseUrl + "trades",
                    paramsA,
                    paramsB;
                user = user || this.user;
                paramsA = "bs=" + (buyOrSell ? "buy" : "sell") + "&count=" + count;
                paramsB = "item=" + item + "&price=" + price + "&tid=" + user.tid + "&timestamp=" + timestamp + "&uid=" + user.uid;
                paramsB += "&signature=" + hmac(paramsA + "&create=create&" + paramsB, user.tkn);
                d3.request(url + "?create=create").header("Content-Type", "application/x-www-form-urlencoded").post(paramsA + "&" + paramsB, callback);
            },
            buy: function (item, count, price, callback, user) {
                this.createTrade(true, item, count, price, callback, user);
            },
            sell: function (item, count, price, callback, user) {
                this.createTrade(false, item, count, price, callback, user);
            },
            cancelTrade: function (trade, callback, user) {
                var timestamp = (new Date()).getTime(),
                    url = baseUrl + "trades",
                    params;
                user = user || this.user;
                trade = (trade instanceof String) ? trade : trade.id;
                params = "tid=" + user.tid + "&timestamp=" + timestamp + "&tradeid=" + trade + "&uid=" + user.uid;
                params += "&signature=" + hmac("cancel=cancel&" + params, user.tkn);
                d3.request(url + "?cancel=cancel").header("Content-Type", "application/x-www-form-urlencoded").post(params, callback);
            },
            takeout: function (trade, callback, user) {
                var timestamp = (new Date()).getTime(),
                    url = baseUrl + "trades",
                    params;
                user = user || this.user;
                trade = (typeof trade === "string") ? trade : trade.id;
                params = "tid=" + user.tid + "&timestamp=" + timestamp + "&tradeid=" + trade + "&uid=" + user.uid;
                params += "&signature=" + hmac("takeout=takeout&" + params, user.tkn);
                d3.request(url + "?takeout=takeout").header("Content-Type", "application/x-www-form-urlencoded").post(params, callback);
            }

        };
    window.kt = kt;
}());