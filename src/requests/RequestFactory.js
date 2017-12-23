import {default as Request} from './Request.js';

export default function createRequestFactory(performRequest) {
    return function() {
        this.create = function(method, type, suburl, params, headers, user, authenticator) {
            var request = new Request(method, type, suburl, params, headers, user, authenticator);
            request.performRequest = performRequest;
            return request;
        };
    };
}