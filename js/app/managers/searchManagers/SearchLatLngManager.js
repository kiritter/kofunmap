(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.SearchLatLngManager = class SearchLatLngManager {
        constructor(gaChannel, mapBoth, globalState, myChannel, clickManager) {
            this.globalState = globalState;
            this.myChannel = myChannel;

            this.coreLeft = new MyApp.SearchLatLngManagerCore(gaChannel, mapBoth.mapLeft, 'left', clickManager.getCoreLeft(), myChannel);
        }

        init() {
            this.coreLeft.init();
            this.settingMyChannel(this.myChannel);
        }

        settingMyChannel(myChannel) {
            var self = this;
            var topicNameLeft = this.coreLeft.getTopicName();
            myChannel.subscribe(topicNameLeft, function(topicName, options) {
                var selectedLatLng = options.selectedLatLng;
            });
        }

    };

}(this));
