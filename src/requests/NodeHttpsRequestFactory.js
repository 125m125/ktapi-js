import createRequestFactory from "./RequestFactory.js";
import https from "https";
import paramsToQuery from "../util/paramsToQuery.js";
import urlParser from "url";
import assign from "object-assign";

function performRequest(method, type, targetUrl, params, headers, callback, options) {
    if (options && ((options.cert && !options.key) || (options.key && !options.cert))) {
        throw new Error("client certificates require both client certificate(options.cert) and client key(options.key)");
    }
    var url = urlParser.parse(targetUrl);
    options = assign(url, options);
    options.headers = headers || {};
    options.headers.accept = "application/json";
    options.method = method;
    if (method === "GET") {
        var hasQuery = options.path.indexOf("?") >= 0;
        if (hasQuery) {
            options.path = options.path + "&";
        } else {
            options.path = options.path + "?";
        }
        options.path = options.path + paramsToQuery(params);
    }
    var request = https.request(options, function(res) {
        var body = "";
        res.on("data", function(chunk) {
            body += chunk;
        });
        res.on("end", function() {
            var response;
            try {
                response = JSON.parse(body);
            } catch (e) {
                return callback(body);
            }
            if (res.statusCode >= 400) return callback(response);
            return callback(null, ((type === "tsv") ? response.entries : response));
        });
    });
    request.on("error", function(error) {
        if (errorTarget) {
            var errorTarget = error.target;
            try {
                errorTarget = JSON.parse(errorTarget.response);
            } catch (e) {
                // parse failed -> call with unparsed errorTarget
            }
            callback(errorTarget);
        }
    });
    if (method !== "GET") {
        request.write(paramsToQuery(params));
    }
    request.end();
}

export default createRequestFactory(performRequest);
