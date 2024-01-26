(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.Ga4Repo = class Ga4Repo {
        constructor(gaChannel, global) {
            this.gaChannel = gaChannel;
            this.window_gtag = global.gtag;
            this.window_navigator = global.navigator;
        }

        doSubscription() {
            var self = this;
            var topicNames = ['ga4event'];
            topicNames.forEach(function(topicName) {
                self.gaChannel.subscribe(topicName, function(topicName, options) {
                    var eventData = self._createEventNameAndParameters(options);
                    self._sendEventData(eventData);
                });
            });
        }

        _createEventNameAndParameters(options) {
            var copiedOptions = Object.assign({}, options);

            var eventName = copiedOptions.eventName;

            delete copiedOptions.eventName;
            var eventParameters = copiedOptions;

            return {eventName: eventName, eventParameters: eventParameters};
        }

        _sendEventData(eventData) {
            var onLine = this.window_navigator.onLine;
            if (onLine) {
                this.window_gtag('event', eventData.eventName, eventData.eventParameters);
            }else{
            }
        }

    };

}(this));
