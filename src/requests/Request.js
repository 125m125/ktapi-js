import {
    default as paramsToQuery
} from '../util/paramsToQuery.js';

var baseUrl = "https://kt.125m125.de/api/v2.0/";

export default function Request(method, type, suburl, params, headers, user, authenticator) {
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
        var self = this;

        function promiseFunction(resolve, reject) {
            self.performRequest(method, type, url, params, headers, function (err, data) {
                if (reject && resolve) {
                    if (err) return reject(err);
                    return resolve(data);
                }
            });
        }
        if (typeof Promise === "function") {
            var promise = new Promise(promiseFunction);
            if (callback && typeof callback === "function") {
                promise.then(callback.bind(null, null), callback.bind(null));
            }
            return promise;
        } else {
            if (callback && typeof callback === "function") {
                promiseFunction(callback.bind(null, null), callback.bind(null));
            } else {
                promiseFunction();
            }
        }
    };
}