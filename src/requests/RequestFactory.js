import {
    default as Request
} from './Request.js';

export default function createRequestFactory(performRequest) {
    return function(options) {
        this.create = function(method, type, suburl, params, headers, user, authenticator) {
            var request = new Request(method, type, suburl, params, headers, user, authenticator);
            request.performRequest = function(method, type, url, params, headers, callback) {
                performRequest(method, type, url, params, headers, callback, options);
            };
            return request;
        };
    };
}
