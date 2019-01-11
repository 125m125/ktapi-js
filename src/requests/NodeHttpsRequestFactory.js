import createRequestFactory from "./RequestFactory.js";
import https from "https";
import paramsToQuery from "../util/paramsToQuery.js";
import urlParser from "url";
import assign from "object-assign";
import crypto from "crypto";

var DEFAULT_FINGERPRINTS = ["Ii0NcQVclBzikUGw+iAV5+UnEmTqQDIhLZifNGM4yHY=", "ZnHPNFeZ/okzKy3UttEwn4O9V8T/qEvByGaE1FLBdq8=", "tcgiMrn7yiqTpt7SDna6sU0faF8m4QUiq24aQVW3F9U=", ];

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
        if (error.target) {
            error = error.target;
            try {
                error = JSON.parse(error.response);
            } catch (e) {
                // parse failed -> call with unparsed errorTarget
            }
        }
        callback(error);
    });
    if (!options.skipKeyPinning) {
        // pin public key, based on https://hassansin.github.io/certificate-pinning-in-nodejs
        request.on('socket', function(socket) {
            socket.on('secureConnect', function() {
                // reused sessions don't have certificate data we can use to check
                if (socket.isSessionReused()) return;
                // lower nodejs-versions don't expose the public key
                if (!socket.getPeerCertificate().pubkey) {
                    return;
                }
                //calculate hash of public key
                var hash = crypto.createHash('sha256');
                hash.update(socket.getPeerCertificate().pubkey);
                var fingerprint = hash.digest('base64');
                // Check if certificate is valid
                // Match the fingerprint with our saved fingerprints
                if ((options.fingerprints || DEFAULT_FINGERPRINTS).indexOf(fingerprint) === -1) {
                    return socket.destroy(new Error('Fingerprint of certificate is not known.'));
                }
            });
        });
    }
    if (method !== "GET") {
        request.write(paramsToQuery(params));
    }
    request.end();
}

export default createRequestFactory(performRequest);
