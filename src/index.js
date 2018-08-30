export {default as Request} from './requests/Request.js';
export {default as createRequestFactory} from './requests/RequestFactory.js';

export {default as KtApi} from './ktapi/core.js';
//? if (HISTORY)
import './ktapi/history.js';
//? if (ITEMS)
import './ktapi/items.js';
//? if (MESSAGES)
import './ktapi/messages.js';
//? if (ORDERBOOK)
import './ktapi/orderbook.js';
//? if (PAYOUTS)
import './ktapi/payouts.js';
//? if (PERMISSIONS)
import './ktapi/permissions.js';
//? if (TRADES)
import './ktapi/trades.js';

//? if (REQUEST_FACTORIES) {
//? if (D3_REQUEST_FACTORY)
export {default as D3RequestFactory} from './requests/D3RequestFactory.js'
//? if (XML_HTTP_REQUEST_FACTORY)
export {default as XMLHttpRequestFactory} from './requests/XMLHttpRequestFactory.js'
//? if (NODE_HTTPS_REQUEST_FACTORY)
export {default as NodeHttpsRequestFactory} from './requests/NodeHttpsRequestFactory';
//? }

//? if (AUTHENTICATORS) {
//? if (BASIC_AUTHENTICATOR)
export {default as BasicAuthenticator} from './authenticators/BasicAuthenticator.js'
//? if (HMAC_AUTHENTICATOR)
export {default as HmacAuthenticator} from './authenticators/HmacAuthenticator.js'
//? }
//? if (PUSHER) {
import './pusher/pusherCore.js';
import './pusher/pusherAuth.js';
import './pusher/pusherSubscribtions.js';
//? }

//? if (typeof ADDITIONAL_IMPORT !== 'undefined') {
//? write('import '+ ADDITIONAL_IMPORT);
//? }

//? if (typeof ADDITIONAL_EXPORT !== 'undefined') {
//? write('export * from '+ ADDITIONAL_EXPORT);
//? }
