import btoa from "btoa";

/**
 * Authenticator which will be used for BasicAuth
 * @constructor BasicAuthenticator
 */
export default function BasicAuthenticator() {
    /**
     * Function to authenticate
     * @param  {String} method  the desired method to use for the request (e.g. GET)
     * @param  {String} type    the data type (e.g. JSON)
     * @param  {String} suburl  the suburl to use
     * @param  {Object} params  params to use for the request
     * @param  {Object} headers headers to use for the request
     * @param  {Object} user    the user object
     * @return {void}
     */
    this.authenticate = function (method, type, suburl, params, headers, user) {
        // set header for authorization
        if (!headers.Authorization) headers.Authorization = "Basic " + btoa(user.tid + ':' + user.tkn);
    };
}