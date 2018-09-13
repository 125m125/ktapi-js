export default function fixXMLHttpRequest() {
    return {
        name: "fixXMLHttpRequest",
        renderChunk: (code, settings, outputOptions) => codefix + code,
    };
}


var codefix = `
if (typeof exports === 'object' && typeof module !== 'undefined') {
    var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    require('xmlhttprequest').XMLHttpRequest = function() {
        var req = new XMLHttpRequest;
        req.target = req;
        var de = req.dispatchEvent;
        req.dispatchEvent = function(event) {
            var a = req["on" + event];
            if (typeof a === "function") {
                a({
                    "target": req
                });
                req["on" + event] = null;
            }
            de(event);
            if (a != null) {
                req["on" + event] = a;
            }
        };
        return req;
    };
};
`
