import { default as HmacAuthenticator } from "../../src/authenticators/HmacAuthenticator";
import tape from "tape";
import sinon from "sinon";

tape("HmacAuthenticator adds correct params without parameters", function (test) {
    var uut = new HmacAuthenticator(),
        params = {},
        headers = {};
    sinon.useFakeTimers(new Date(946684800));
    uut.authenticate("GET", "tsv", "/ping", params, headers, { "uid": "1", "tid": "2", "tkn": "4" });
    test.deepEquals(params, { tid: "2", timestamp: 946924800, signature: "435b0fa9fb69286007f9678e88ea65af8dcacc379d4a14c1cd7fa36ca3ff3ba7" });
    test.deepEqual(headers, {});
    test.end();
});

tape("HmacAuthenticator reuses time if in limit", function (test) {
    var uut = new HmacAuthenticator(),
        params = {},
        headers = {};
    sinon.useFakeTimers(new Date(946684800));
    uut.authenticate("GET", "tsv", "/ping", {}, {}, { "uid": "1", "tid": "2", "tkn": "4" });
    sinon.useFakeTimers(new Date(947144800));
    uut.authenticate("GET", "tsv", "/ping", params, headers, { "uid": "1", "tid": "2", "tkn": "4" });
    test.deepEquals(params, { tid: "2", timestamp: 946924800, signature: "435b0fa9fb69286007f9678e88ea65af8dcacc379d4a14c1cd7fa36ca3ff3ba7" });
    test.deepEqual(headers, {});
    test.end();
});

tape("HmacAuthenticator handles multiple users", function (test) {
    var uut = new HmacAuthenticator(),
        params = {},
        headers = {};
    sinon.useFakeTimers(new Date(946684800));
    uut.authenticate("GET", "tsv", "/ping", {}, {}, { "uid": "2", "tid": "4", "tkn": "8" });
    uut.authenticate("GET", "tsv", "/ping", params, headers, { "uid": "1", "tid": "2", "tkn": "4" });
    test.deepEquals(params, { tid: "2", timestamp: 946924800, signature: "435b0fa9fb69286007f9678e88ea65af8dcacc379d4a14c1cd7fa36ca3ff3ba7" });
    test.deepEqual(headers, {});
    test.end();
});

tape("HmacAuthenticator uses new time if out of limit", function (test) {
    var uut = new HmacAuthenticator(),
        params = {},
        headers = {};
    sinon.useFakeTimers(new Date(946684800));
    uut.authenticate("GET", "tsv", "/ping", {}, {}, { "uid": "1", "tid": "2", "tkn": "4" });
    sinon.useFakeTimers(new Date(947184800));
    uut.authenticate("GET", "tsv", "/ping", params, headers, { "uid": "1", "tid": "2", "tkn": "4" });
    test.deepEquals(params, { tid: "2", timestamp: 947424800, signature: "6b17e46f53d9024568a4977a1f4a17983788c1b674f90f378c52eb60a67f7bc4" });
    test.deepEqual(headers, {});
    test.end();
});

tape("HmacAuthenticator uses existing parameters for signature", function (test) {
    var uut = new HmacAuthenticator(),
        params = { please: "useme", use: "me", tie: "between" },
        headers = {};
    sinon.useFakeTimers(new Date(946684800));
    uut.authenticate("GET", "tsv", "/ping", params, headers, { "uid": "1", "tid": "2", "tkn": "4" });
    test.deepEquals(params, { please: "useme", use: "me", tie: "between", tid:"2", timestamp: 946924800, signature: "c9c4bef0befd5b532e288afbd321c3086c58deddfd89c4aae1f8439bab2f6aed" });
    test.deepEqual(headers, {});
    test.end();
});