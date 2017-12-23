import jsSHA from 'jssha';
import { default as paramsToQuery } from '../util/paramsToQuery.js';

function HmacAuthenticator() {
    this.maxSignatureOffset = 4 * 60 * 1000;
    this.hashType = "SHA-256";
    this.dTime = 0;
    var last = 0;
    this.authenticate = function (method, type, suburl, params, headers, user) {
        params.tid = user.tid;
        if (last) {
            if (last < new Date().getTime() - this.maxSignatureOffset) {
                last = new Date().getTime() + this.maxSignatureOffset;
            }
        } else {
            last = new Date().getTime() + this.maxSignatureOffset;
        }
        params.timestamp = last + this.dTime;
        params.signature = this.hmac(paramsToQuery(params), user.tkn, this.hashType);
    };
}
HmacAuthenticator.prototype.hmac = function (text, key, hashType) {
    var shaObj = new jsSHA(hashType, "TEXT");
    shaObj.setHMACKey(key, "TEXT");
    shaObj.update(text);
    return shaObj.getHMAC("HEX");
};

export default HmacAuthenticator;