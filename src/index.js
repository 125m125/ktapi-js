export {default as Request} from './requests/Request.js';
export {default as createRequestFactory} from './requests/RequestFactory.js';

export {default as KtApi} from './ktapi/core.js';
//? if (typeof NO_HISTORY === 'undefined')
import './ktapi/history.js';
//? if (typeof NO_ITEMS === 'undefined')
import './ktapi/items.js';
//? if (typeof NO_MESSAGES === 'undefined')
import './ktapi/messages.js';
//? if (typeof NO_ORDERBOOK === 'undefined')
import './ktapi/orderbook.js';
//? if (typeof NO_PAYOUTS === 'undefined')
import './ktapi/payouts.js';
//? if (typeof NO_PERMISSIONS === 'undefined')
import './ktapi/permissions.js';
//? if (typeof NO_TRADES === 'undefined')
import './ktapi/trades.js';

//? if (typeof NO_REQUEST_FACTORY === 'undefined') {
//? if (typeof NO_D3_REQUEST_FACTORY === 'undefined')
export {default as D3RequestFactory} from './requests/D3RequestFactory.js'
//? }

//? if (typeof NO_AUTHENTICATOR === 'undefined') {
//? if (typeof NO_BASIC_AUTHENTICATOR === 'undefined')
export {default as BasicAuthenticator} from './authenticators/BasicAuthenticator.js'
//? if (typeof NO_HMAC_AUTHENTICATOR === 'undefined')
export {default as HmacAuthenticator} from './authenticators/HmacAuthenticator.js'
//? }
//? if (typeof NO_PUSHER === 'undefined') {
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