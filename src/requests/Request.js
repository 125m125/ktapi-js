import { default as paramsToQuery } from '../util/paramsToQuery.js';

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
        this.performRequest(method, type, url, params, headers, callback);
    };
}