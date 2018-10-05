export default function NotificationManager () {
    this.subscribe = function() {
        throw new Error('Subscribe must be implemented as a function');
    };
}

NotificationManager.prototype.subscribeItems = function(callback, selfCreated) {
    this.subscribe('Items', selfCreated, callback, true);
};

NotificationManager.prototype.subscribeOrders = function(callback, selfCreated) {
    this.subscribe('Orders', selfCreated, callback, true);
};

NotificationManager.prototype.subscribePayouts = function(callback, selfCreated) {
    this.subscribe('Payouts', selfCreated, callback, true);
};

NotificationManager.prototype.subscribeMessages = function(callback, selfCreated) {
    this.subscribe('Messages', selfCreated, callback, true);
};

NotificationManager.prototype.subscribeOrderbook = function(callback) {
    this.subscribe('order', false, callback, false);
};

NotificationManager.prototype.subscribeHistory = function(callback) {
    this.subscribe('history', false, callback, false);
};