import tape from "tape";
import nock from "nock";

import Factory from "../../src/requests/D3FetchRequestFactory";
import Request from "../../src/requests/Request";


tape("factory returns a Request on create", t => {
    var uut = new Factory();
    t.true(uut.create() instanceof Request);
    t.end();
});

tape("request returns parsed data for successful get request without data", t => {
    var uut = new Factory();
    nock('https://example.nonExistant')
        .get('/123/messages')
        .reply(200, "type	price	amount\r\nsell	838.840000	1328");
    uut.create().performRequest("GET", "tsv", "https://example.nonExistant/123/messages", null, {}, function(err, res) {
        t.false(err, "response is not an error");
        t.equals(res.length, 1);
        t.deepEquals(res[0], {
            type: "sell",
            price: "838.840000",
            amount: "1328"
        });
        t.end();
    });
});

tape("request returns parsed error data for failed get request", t => {
    var uut = new Factory();
    nock('https://example.nonExistant')
        .get('/123/messages')
        .reply(404, {
            "code": 404,
            "message": "Not Found",
            "humanReadableMessage": "Die angefragte Seite konnte nicht gefunden werden."
        });
    uut.create().performRequest("GET", "tsv", "https://example.nonExistant/123/messages", null, {}, function(err, res) {
        t.deepEquals(err, {
            "code": 404,
            "message": "Not Found",
            "humanReadableMessage": "Die angefragte Seite konnte nicht gefunden werden."
        });
        t.false(res, "response should not contain success data");
        t.end();
    });
});
