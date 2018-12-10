export default function fixXMLHttpRequest() {
    return {
        name: "fixXMLHttpRequest",
        renderChunk: (code, settings, outputOptions) => codefix + code,
    };
}


// xmlhttprequest in the node repository is not up to date. So we take the latest version from github (located in the file githubXMLHttpRequest.js) and inject our own special bugfix on top of that.
var codefix = `
if (typeof exports === 'object' && typeof module !== 'undefined') {
    var XMLHttpRequest = ` + require("fs").readFileSync('./rollupExtra/githubXMLHttpRequest.js') + `;
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
`;
