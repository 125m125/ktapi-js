import * as d3 from "d3-fetch";
import paramsToQuery from '../util/paramsToQuery.js';
import createRequestFactory from './RequestFactory.js';
import fetch from 'node-fetch';
// d3-fetch uses hardcoded fetch. This requires a global polifill for fetch in node
if (typeof exports === 'object' && typeof module !== 'undefined' && typeof global === 'object') {
    global.fetch = fetch;
}

function performRequest(method, type, url, params, headers, callback) {
    d3[type](url, {
        method,
        body: paramsToQuery(params),
    }).then(callback.bind(null, false)).catch(function(error) {
        console.log("real error ", error);
        try {
            error = JSON.parse(error.response);
        } catch (e) {
            // parse failed -> call with unparsed error
        }
        callback(error);
    });
}

export default createRequestFactory(performRequest);
