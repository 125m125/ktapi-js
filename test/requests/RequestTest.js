import Request from "../../src/requests/Request";
import tape from "tape";
import sinon from "sinon";

tape("Request handles empty get parameters and headers", function(test) {
    var uut = new Request("GET", "d3", "test");
    uut.performRequest = sinon.spy();
    var callback = function() {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("GET", "d3", sinon.match.string, null, sinon.match.object, sinon.match.func));
    test.end();
});

tape("Request handles empty post parameters and headers", function(test) {
    var uut = new Request("POST", "d3", "test");
    uut.performRequest = sinon.spy();
    var callback = function() {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match.string, sinon.match.object, sinon.match.object, sinon.match.func));
    test.end();
});

tape("Request creates url for empty get parameters", function(test) {
    var uut = new Request("GET", "d3", "test", {}, {});
    uut.performRequest = sinon.spy();
    var callback = function() {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("GET", "d3", "https://kt.125m125.de/api/v2.0/test?", null, sinon.match.object, sinon.match.func));
    test.end();
});

tape("Request creates url for get parameters", function(test) {
    var uut = new Request("GET", "d3", "test", {
        "a": "b",
        "y": "a",
        "c": "d"
    }, {});
    uut.performRequest = sinon.spy();
    var callback = function() {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("GET", "d3", "https://kt.125m125.de/api/v2.0/test?a=b&c=d&y=a", null, sinon.match.object, sinon.match.func));
    test.end();
});

tape("Request creates url for post parameters", function(test) {
    var uut = new Request("POST", "d3", "test", {
        "a": "b",
        "y": "a",
        "c": "d"
    }, {});
    uut.performRequest = sinon.spy();
    var callback = function() {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", "https://kt.125m125.de/api/v2.0/test", sinon.match.object, sinon.match.object, sinon.match.func));
    test.end();
});

tape("Request passes post parameters to performRequest", function(test) {
    var uut = new Request("POST", "d3", "test", {
        "a": "b",
        "c": "d"
    }, {});
    uut.performRequest = sinon.spy();
    var callback = function() {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match.string, sinon.match.has("a", "b").and(sinon.match.has("c", "d")), sinon.match.object, sinon.match.func));
    test.end();
});

tape("Request adds Content-Type header if not present", function(test) {
    var uut = new Request("POST", "d3", "test", {}, {});
    uut.performRequest = sinon.spy();
    var callback = function() {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match.string, sinon.match.object, sinon.match.has("Content-Type", "application/x-www-form-urlencoded"), sinon.match.func));
    test.end();
});

tape("Request keeps Content-Type header if present", function(test) {
    var uut = new Request("POST", "d3", "test", {}, {
        "Content-Type": "not-form-url-encoded"
    });
    uut.performRequest = sinon.spy();
    var callback = function() {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match.string, sinon.match.object, sinon.match.has("Content-Type", "not-form-url-encoded"), sinon.match.func));
    test.end();
});

tape("Request calls authenticator if present", function(test) {
    var authenticator = {};
    authenticator.authenticate = sinon.spy();
    var uut = new Request("GET", "d3", "test", {}, {}, {
        "uid": "4"
    }, authenticator);
    uut.performRequest = sinon.spy();
    var callback = function() {};

    uut.execute(callback);

    test.ok(authenticator.authenticate.calledWith("GET", "d3", "test", {}, {}, {
        "uid": "4"
    }));
    test.end();
});

tape("Request replaces user path parameter", function(test) {
    var uut = new Request("POST", "d3", "test/{user}", {}, {}, {
        "uid": "4"
    });
    uut.performRequest = sinon.spy();
    var callback = function() {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match("test/4"), sinon.match.object, sinon.match.object, sinon.match.func));
    test.end();
});

tape("Request replaces path parameter", function(test) {
    var uut = new Request("POST", "d3", "test/{someParameter}", {
        "someParameter": "42",
        "otherParameter": "hi"
    }, {}, {
        "uid": "4"
    });
    uut.performRequest = sinon.spy();
    var callback = function() {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match("test/42"), {
        "otherParameter": "hi"
    }, sinon.match.object, sinon.match.func));
    test.end();
});

tape("Request keeps undefined path parameter", function(test) {
    var uut = new Request("POST", "d3", "test/{unknownParameter}", {
        "someParameter": "42",
        "otherParameter": "hi"
    }, {}, {
        "uid": "4"
    });
    uut.performRequest = sinon.spy();
    var callback = function() {};

    uut.execute(callback);

    test.ok(uut.performRequest.calledWith("POST", "d3", sinon.match("test/{unknownParameter}"), sinon.match.object, sinon.match.object, sinon.match.func));
    test.end();
});

tape("Request uses promises for success", function(test) {
    var uut = new Request("GET", "d3", "test", {}, {});
    uut.performRequest = function(method, type, url, params, headers, callback) {
        callback(null, {
            "test": "success"
        });
    };

    uut.execute().then(function(data) {
        test.deepEqual(data, {
            "test": "success"
        });
        test.end();
    }).catch(function(err) {
        test.fail("expected catch, got catch with " + err);
        test.end();
    });
});

tape("Request uses promises for failure", function(test) {
    var uut = new Request("GET", "d3", "test", {}, {});
    uut.performRequest = function(method, type, url, params, headers, callback) {
        callback({
            "test": "success"
        });
    };

    uut.execute().then(function(data) {
        test.fail("expected catch, got then with " + data);
        test.end();
    }).catch(function(err) {
        test.deepEqual(err, {
            "test": "success"
        });
        test.end();
    });
});

tape("Request uses callback for success if present", function(test) {
    var uut = new Request("GET", "d3", "test", {}, {});
    uut.performRequest = function(method, type, url, params, headers, callback) {
        callback(null, {
            "test": "success"
        });
    };

    uut.execute(function(err, data) {
        test.deepEqual({
            "test": "success"
        }, data);
        test.notOk(err);
        test.end();
    });
});

tape("Request uses callback for failure if present", function(test) {
    var uut = new Request("GET", "d3", "test", {}, {});
    uut.performRequest = function(method, type, url, params, headers, callback) {
        callback({
            "test": "success"
        });
    };

    uut.execute(function(err, data) {
        test.deepEqual({
            "test": "success"
        }, err);
        test.notOk(data);
        test.end();
    });
});

function tapeWithoutPromise(name, testFunction) {
    tape(name, function(test) {
        var realPromise = Promise;
        Promise = undefined;

        try {
            testFunction(test);
        } finally {
            Promise = realPromise;
        }

    });

}

tapeWithoutPromise("Request does not throw when Promises not supported and no callback defined", function(test) {
    var uut = new Request("GET", "d3", "test", {}, {});
    uut.performRequest = function(method, type, url, params, headers, callback) {
        callback({
            "test": "success"
        });
    };

    uut.execute();
    test.end();
});

tapeWithoutPromise("Request uses callback for success if present and Promises are undefined", function(test) {
    var uut = new Request("GET", "d3", "test", {}, {});
    uut.performRequest = function(method, type, url, params, headers, callback) {
        callback(null, {
            "test": "success"
        });
    };

    uut.execute(function(err, data) {
        test.deepEqual({
            "test": "success"
        }, data);
        test.notOk(err);
        test.end();
    });
});

tapeWithoutPromise("Request uses callback for failure if present and Promises are undefined", function(test) {
    var uut = new Request("GET", "d3", "test", {}, {});
    uut.performRequest = function(method, type, url, params, headers, callback) {
        callback({
            "test": "success"
        });
    };

    uut.execute(function(err, data) {
        test.deepEqual({
            "test": "success"
        }, err);
        test.notOk(data);
        test.end();
    });
});
