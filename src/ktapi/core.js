export default function (uid, tid, tkn, requestFactory, authenticator) {
    if (typeof requestFactory === 'undefined') {
        throw new TypeError("missing required requestFactory");
    }
    var user = {
        "uid": uid,
        "tid": tid,
        "tkn": tkn
    };
    this.getUserID = function () {
        return user.uid;
    };
    this.getRequest = function (method, type, suburl, params, headers, auth) {
        var requestAuthenticator;
        if (auth) {
            requestAuthenticator = authenticator;
        }
        return requestFactory.create(method, type, suburl, params, headers, user, requestAuthenticator);
    };
    this.performRequest = function (method, type, suburl, params, headers, auth, callback) {
        return this.getRequest(method, type, suburl, params, headers, auth).execute(callback);
    };
}