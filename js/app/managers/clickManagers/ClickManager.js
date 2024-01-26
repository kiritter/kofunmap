(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.ClickManager = class ClickManager {
        constructor(mapBoth, globalState, myChannel, distanceCircleFactory, oldEditionMapIdRepo) {
            this.mapLeft = mapBoth.mapLeft;
            this.globalState = globalState;
            this.myChannel = myChannel;
            this.distanceCircleFactory = distanceCircleFactory;
            this.oldEditionMapIdRepo = oldEditionMapIdRepo;

            this.coreLeft = new MyApp.ClickManagerCore(mapBoth.mapLeft, 'left', myChannel, distanceCircleFactory, oldEditionMapIdRepo);
        }

        init() {
            this.coreLeft.init();
            this.settingMyChannelForCore(this.myChannel);
        }

        settingMyChannelForCore(myChannel) {
            var self = this;
            var topicNameLeft = this.coreLeft.getTopicName();
            myChannel.subscribe(topicNameLeft, function(topicName, options) {
            });
        }


        getCoreLeft() {
            return this.coreLeft;
        }
        getCurrentLatlngLeft() {
            return this.coreLeft.getCurrentLatlng();
        }

        showLatLngInfoAndCircles(dcLatLngLeft) {
            this.coreLeft.showLatLngInfoAndCircles(dcLatLngLeft);
        }

    };

}(this));
