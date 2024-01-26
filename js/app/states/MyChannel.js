(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MyChannel = class MyChannel {
        constructor(isAsyncPublish) {
            this.isAsyncPublish = (isAsyncPublish) ? true : false;
            this.topics = [];
        }

        subscribe(topicName, subscriber) {
            if (this._contains(topicName) === false) {
                this.topics.push(new MyApp.MyTopic(topicName));
            }
            var i = this._indexOf(topicName);
            this.topics[i].addSubscriber(subscriber);
        }

        unsubscribe(topicName, subscriber) {
            var i = this._indexOf(topicName);
            if (i >= 0) {
                this.topics[i].removeSubscriber(subscriber);
                if (this.topics[i].hasSubscribers() === false) {
                    this._remove(i);
                }
            }
        }

        _contains(topicName) {
            var i = this._indexOf(topicName);
            if (i >= 0) {
                return true;
            }
            return false;
        }

        _indexOf(topicName) {
            var len = this.topics.length;
            for (var i = 0; i < len; i++) {
                if (this.topics[i].is(topicName)) {
                    return i;
                }
            }
            return -1;
        }

        _remove(i) {
            this.topics.splice(i, 1);
        }


        publish(topicName, options) {
            var i = this._indexOf(topicName);
            if (i >= 0) {
                if (this.isAsyncPublish === false) {
                    this._publish(i, options);
                }else{
                    this._publishAsync(i, options);
                }
            }
        }
        _publish(i, options) {
            this.topics[i].publish(options);
        }
        _publishAsync(i, options) {
            var self = this;
            var timerId = setTimeout(function() {
                clearTimeout(timerId);
                self.topics[i].publish(options);
            }, 0);
        }

        __getTopics() {
            return this.topics;
        }
    };

    MyApp.MyTopic = class MyTopic {
        constructor(topicName) {
            this.topicName = topicName;
            this.subscribers = [];
        }

        addSubscriber(subscriber) {
            if (this._contains(subscriber)) {
                return;
            }
            this.subscribers.push(subscriber);
        }

        removeSubscriber(subscriber) {
            if (this._contains(subscriber) === false) {
                return;
            }
            this._remove(subscriber);
        }

        _contains(subscriber) {
            var i = this.subscribers.indexOf(subscriber);
            if (i >= 0) {
                return true;
            }
            return false;
        }

        _remove(subscriber) {
            var i = this.subscribers.indexOf(subscriber);
            if (i >= 0) {
                this.subscribers.splice(i, 1);
            }
        }

        is(topicName) {
            if (this.topicName === topicName) {
                return true;
            }
            return false;
        }

        hasSubscribers() {
            if (this.subscribers.length === 0) {
                return false;
            }
            return true;
        }

        __getTopicName() {
            return this.topicName;
        }
        __getSubscribers() {
            return this.subscribers;
        }

        publish(options) {
            var self = this;
            this.subscribers.forEach(function(callback) {
                callback(self.topicName, options);
            });
        }
    };

}(this));
