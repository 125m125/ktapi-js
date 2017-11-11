import Request from "../../src/requests/Request";
import tape from "tape";
import sinon from "sinon";

tape("Request handles empty get parameters and headers", function (test) {
    var uut = new Request("GET", "d3", "test");
    uut.performRequest = sinon.spy();
    var callback = function () {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("GET", "d3", sinon.match.defined, null, sinon.match.defined, callback));
    test.end();
});

tape("Request handles empty post parameters and headers", function (test) {
    var uut = new Request("POST", "d3", "test");
    uut.performRequest = sinon.spy();
    var callback = function () {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match.defined, sinon.match.defined, sinon.match.defined, callback));
    test.end();
});

tape("Request creates url for empty get parameters", function (test) {
    var uut = new Request("GET", "d3", "test", {}, {});
    uut.performRequest = sinon.spy();
    var callback = function () {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("GET", "d3", "https://kt.125m125.de/api/v2.0/test?", null, sinon.match.defined, callback));
    test.end();
});

tape("Request creates url for get parameters", function (test) {
    var uut = new Request("GET", "d3", "test", {
        "a": "b",
        "y": "a",
        "c": "d"
    }, {});
    uut.performRequest = sinon.spy();
    var callback = function () {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("GET", "d3", "https://kt.125m125.de/api/v2.0/test?a=b&c=d&y=a", null, sinon.match.defined, callback));
    test.end();
});

tape("Request creates url for post parameters", function (test) {
    var uut = new Request("POST", "d3", "test", {
        "a": "b",
        "y": "a",
        "c": "d"
    }, {});
    uut.performRequest = sinon.spy();
    var callback = function () {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", "https://kt.125m125.de/api/v2.0/test", sinon.match.defined, sinon.match.defined, callback));
    test.end();
});

tape("Request passes post parameters to performRequest", function (test) {
    var uut = new Request("POST", "d3", "test", {
        "a": "b",
        "c": "d"
    }, {});
    uut.performRequest = sinon.spy();
    var callback = function () {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match.defined, sinon.match.has("a", "b").and(sinon.match.has("c", "d")), sinon.match.defined, callback));
    test.end();
});

tape("Request adds Content-Type header if not present", function (test) {
    var uut = new Request("POST", "d3", "test", {}, {});
    uut.performRequest = sinon.spy();
    var callback = function () {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match.defined, sinon.match.defined, sinon.match.has("Content-Type", "application/x-www-form-urlencoded"), callback));
    test.end();
});

tape("Request keeps Content-Type header if present", function (test) {
    var uut = new Request("POST", "d3", "test", {}, {
        "Content-Type": "not-form-url-encoded"
    });
    uut.performRequest = sinon.spy();
    var callback = function () {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match.defined, sinon.match.defined, sinon.match.has("Content-Type", "not-form-url-encoded"), callback));
    test.end();
});

tape("Request calls authenticator if present", function (test) {
    var authenticator = {};
    authenticator.authenticate = sinon.spy();
    var uut = new Request("GET", "d3", "test", {}, {}, {
        "uid": "4"
    }, authenticator);
    uut.performRequest = sinon.spy();
    var callback = function () {};

    uut.execute(callback);

    test.ok(authenticator.authenticate.calledWith("GET", "d3", "test", {}, {}, {
        "uid": "4"
    }));
    test.end();
});

tape("Request replaces user path parameter", function (test) {
    var uut = new Request("POST", "d3", "test/{user}", {}, {}, {
        "uid": "4"
    });
    uut.performRequest = sinon.spy();
    var callback = function () {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match("test/4"), sinon.match.defined, sinon.match.defined, callback));
    test.end();
});

tape("Request replaces path parameter", function (test) {
    var uut = new Request("POST", "d3", "test/{someParameter}", {
        "someParameter": "42",
        "otherParameter": "hi"
    }, {}, {
        "uid": "4"
    });
    uut.performRequest = sinon.spy();
    var callback = function () {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match("test/42"), {
        "otherParameter": "hi"
    }, sinon.match.defined, callback));
    test.end();
});

tape("Request keeps undefined path parameter", function (test) {
    var uut = new Request("POST", "d3", "test/{unknownParameter}", {
        "someParameter": "42",
        "otherParameter": "hi"
    }, {}, {
        "uid": "4"
    });
    uut.performRequest = sinon.spy();
    var callback = function () {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match("test/{unknownParameter}"), sinon.match.defined, sinon.match.defined, callback));
    test.end();
});