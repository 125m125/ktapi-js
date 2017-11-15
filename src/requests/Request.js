import paramsToQuery from '../util/paramsToQuery.js';
import replacePathParameters from '../util/replacePathParameters';

var baseUrl = "https://kt.125m125.de/api/v2.0/";

export default function Request(method, type, suburl, params, headers, user, authenticator) {
    this.method = method;
    this.type = type;
    this.suburl = suburl;
    this.params = params || {};
    this.headers = headers || {};
    this.user = user;
    this.authenticator = authenticator;
}
Request.prototype.execute = function (callback) {
    this.prepareUrl();

    if (typeof Promise === "function") {
        var promise = new Promise(this.promiseFunction.bind(this));
        if (callback && typeof callback === "function") {
            promise.then(callback.bind(null, null), callback.bind(null));
        }
        return promise;
    } else {
        if (callback && typeof callback === "function") {
            this.promiseFunction(callback.bind(null, null), callback.bind(null));
        } else {
            this.promiseFunction();
        }
    }
};

Request.prototype.promiseFunction = function (resolve, reject) {
    this.performRequest(this.method, this.type, this.url, this.params, this.headers, function (err, data) {
        if (reject && resolve) {
            if (err) return reject(err);
            return resolve(data);
        }
    });
};

Request.prototype.prepareUrl = function () {
    if (this.url) return;
    var parameterizedUrl = replacePathParameters(this.suburl, this.params, this.user);
    if (this.authenticator) {
        this.authenticator.authenticate(this.method, this.type, parameterizedUrl, this.params, this.headers, this.user);
    }
    if (this.method === "GET") {
        this.url = baseUrl + parameterizedUrl + "?" + paramsToQuery(this.params);
        this.params = null;
    } else {
        this.url = baseUrl + parameterizedUrl;
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
    }
};