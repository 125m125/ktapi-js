import { default as Request } from '../requests/Request.js';

export default function (uid, tid, tkn, authenticator) {
    var user = {
        "uid": uid,
        "tid": tid,
        "tkn": tkn
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