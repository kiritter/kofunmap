(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.Ga4Channel = class Ga4Channel {
        constructor() {
            var isAsyncPublish = true;
            this.myChannel = new MyApp.MyChannel(isAsyncPublish);

            this.LIMIT_LENGTH_PARAM_VALUE = 100;
        }

        subscribe(topicName, subscriber) {
            this.myChannel.subscribe(topicName, subscriber);
        }


        publish(elementName) {
            var topicName = 'ga4event';
            var options = {
                eventName: 'click_element',
                'element_type': 'function',
                'element_name': elementName,
                'event_content': '',
            };
            this.myChannel.publish(topicName, options);
        }
        publishWithContent(elementName, content) {
            var topicName = 'ga4event';
            var trimmedContent = this._createTextWithinLimit(content, this.LIMIT_LENGTH_PARAM_VALUE);
            var options = {
                eventName: 'click_element',
                'element_type': 'function',
                'element_name': elementName,
                'event_content': trimmedContent,
            };
            this.myChannel.publish(topicName, options);
        }
        publishError(elementName, content) {
            var topicName = 'ga4event';
            var trimmedContent = this._createTextWithinLimit(content, this.LIMIT_LENGTH_PARAM_VALUE);
            var options = {
                eventName: 'error_occurred',
                'element_type': 'function',
                'element_name': elementName,
                'event_content': trimmedContent,
            };
            this.myChannel.publish(topicName, options);
        }

        publishForData(elementName) {
            var topicName = 'ga4event';
            var options = {
                eventName: 'click_element',
                'element_type': 'data',
                'element_name': elementName,
                'event_content': '',
            };
            this.myChannel.publish(topicName, options);
        }

        _createTextWithinLimit(text, limitLength) {
            if (text.length <= limitLength) {
                return text;
            } else {
                return text.substring(0, limitLength);
            }
        }

    };

}(this));
