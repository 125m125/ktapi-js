export default function NotificationManager () {
    /**
     * Subscribe function - needs to be implemented, otherwise it triggers an error
     */
    this.subscribe = function() {
        throw new Error('Subscribe must be implemented as a function');
    };
}

/**
 * Subscribe to items event
 * @param {Function} callback callback function
 * @param {Boolean} selfCreated whether or not action was triggered from user itself
 */
NotificationManager.prototype.subscribeItems = function(callback, selfCreated) {
    this.subscribe('Items', selfCreated, callback, true);
};

/**
 * Subscribe to orders event
 * @param {Function} callback callback function
 * @param {Boolean} selfCreated whether or not action was triggered from user itself
 */
NotificationManager.prototype.subscribeOrders = function(callback, selfCreated) {
    this.subscribe('Orders', selfCreated, callback, true);
};

/**
 * Subscribe to payouts event
 * @param {Function} callback callback function
 * @param {Boolean} selfCreated whether or not action was triggered from user itself
 */
NotificationManager.prototype.subscribePayouts = function(callback, selfCreated) {
    this.subscribe('Payouts', selfCreated, callback, true);
};

/**
 * Subscribe to messages event
 * @param {Function} callback callback function
 * @param {Boolean} selfCreated whether or not action was triggered from user itself
 */
NotificationManager.prototype.subscribeMessages = function(callback, selfCreated) {
    this.subscribe('Messages', selfCreated, callback, true);
};

/**
 * Subscribe to order event
 * @param {Function} callback callback function
 */
NotificationManager.prototype.subscribeOrderbook = function(callback) {
    this.subscribe('order', false, callback, false);
};

/**
 * Subscribe to history event
 * @param {Function} callback callback function
 */
NotificationManager.prototype.subscribeHistory = function(callback) {
    this.subscribe('history', false, callback, false);
};