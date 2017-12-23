import * as d3 from "d3-request";
import { default as paramsToQuery } from '../util/paramsToQuery.js';
import { default as createRequestFactory} from './RequestFactory.js';

function performRequest(method, type, url, params, headers, callback) {
    var request;
    request = d3[type](url);
    Object.keys(headers).forEach(function (key) {
        request.header(key, headers[key]);
    });
    request.on("error", function (error) {
        var errorTarget = error.target;
        try{
            errorTarget = JSON.parse(errorTarget.response);
        } catch (e) {
            // parse failed -> call with unparsed errorTarget
        }
        callback(errorTarget);
    }).on("load", function (data) {
        callback(false, data);
    });
    request.send(method, paramsToQuery(params));
}

export default createRequestFactory(performRequest);