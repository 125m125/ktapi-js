import { default as ImportedXMLHttpRequest } from "xmlhttprequest";
import { default as paramsToQuery } from '../util/paramsToQuery.js';
import { default as createRequestFactory } from './RequestFactory.js';

// fix differences between node-xmlhttprequest and browser-XMLHttpRequest
var XMLHttpRequest;
if (ImportedXMLHttpRequest && ImportedXMLHttpRequest.XMLHttpRequest) {
    XMLHttpRequest = ImportedXMLHttpRequest.XMLHttpRequest;
    XMLHttpRequest.DONE = 4;
} else {
    XMLHttpRequest = ImportedXMLHttpRequest;
}

/**
 * Function which performs XMLHttpRequest based on given params
 * @param  {String}   method    the method to use for this request (e.g. GET)
 * @param  {String}   type      the type of the request
 * @param  {String}   url       the url to use for this request
 * @param  {Object}   params    params to use for this request
 * @param  {Object}   headers   the headers to use for this request
 * @param  {Function} callback  callback function
 * @return {void}
 */
function performRequest(method, type, url, params, headers, callback) {
    var request;

    try {
        request = new XMLHttpRequest();

        // apply listener for the request
        request.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE) {
                var response;
                try {
                    response = JSON.parse(this.responseText);
                } catch (e) {
                    return callback(this);
                }
                if(this.status >= 400) return callback(response);
                return callback(null, ((type === 'tsv')? response.entries : response));
            }
        };
        request.onerror = function(e) {
            callback(e, null);
        };
        // prepare the request
        request.open(method, url, true);
        // apply headers
        request.setRequestHeader("Accept", "application/json");
        Object.keys(headers).forEach(function (key) {
            request.setRequestHeader(key, headers[key]);
        });
        // send the request
        request.send(paramsToQuery(params));
    } catch (e) {
        callback(e, null);
    }
};

export default createRequestFactory(performRequest);
