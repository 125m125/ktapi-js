import paramsToQuery from '../util/paramsToQuery.js';
import replacePathParameters from '../util/replacePathParameters';

var baseUrl = "https://kt.125m125.de/api/v2.0/";

export default function Request(method, type, suburl, params, headers, user, authenticator) {
    this.execute = function (callback) {
        if (!params) {
            params = {};
        }
        if (!headers) {
            headers = {};
        }
        suburl = replacePathParameters(suburl, params, user);
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