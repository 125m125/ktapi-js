import { default as BasicAuthenticator } from "../../src/authenticators/BasicAuthenticator";
import tape from "tape";

tape("BasicAuthenticator adds correct header", function (test) {
    var uut = new BasicAuthenticator(),
        params = {},
        headers = {};
    uut.authenticate("GET", "tsv", "/ping", params, headers, { "uid": "1", "tid": "2", "tkn": "4" });
    test.deepEqual(params, {});
    test.deepEqual(headers, { "Authorization": "Basic Mjo0" });
    test.end();
});

tape("BasicAuthenticator handles multiple users", function (test) {
    var uut = new BasicAuthenticator(),
        params = {},
        headers = {};
    uut.authenticate("GET", "tsv", "/ping", {}, {}, { "uid": "1", "tid": "2", "tkn": "4" });
    uut.authenticate("GET", "tsv", "/ping", params, headers, { "uid": "8", "tid": "16", "tkn": "32" });
    test.deepEqual(params, {});
    test.deepEqual(headers, { "Authorization": "Basic MTY6MzI=" });
    test.end();
});

tape("BasicAuthenticator keeps existing authorization header", function (test) {
    var uut = new BasicAuthenticator(),
        params = {},
        headers = { "Authorization": "success" };
    uut.authenticate("GET", "tsv", "/ping", params, headers, { "uid": "1", "tid": "2", "tkn": "4" });
    test.deepEqual(headers, { "Authorization": "success" });
    test.end();
});