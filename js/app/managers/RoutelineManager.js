(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.RoutelineManager = class RoutelineManager {
        constructor(gaChannel, mapBoth, globalState, myChannel) {
            this.mapLeft = mapBoth.mapLeft;
            this.globalState = globalState;
            this.myChannel = myChannel;

            this.kofunManager = new MyApp.MarkerKofunManager(gaChannel, mapBoth, globalState);
            this.shrineManager = new MyApp.MarkerShrineManager(null, mapBoth, globalState);
            this.nearbyManager = new MyApp.MarkerNearbyManager(null, mapBoth, globalState);
            this.museumManager = new MyApp.MarkerMuseumManager(null, mapBoth, globalState);
            this.landmarkManager = new MyApp.MarkerLandmarkManager(null, mapBoth, globalState);
            this.descManager = new MyApp.MarkerDescManager(null, mapBoth, globalState);
        }

        async init() {
            await this._initAll();


            this.settingMyChannel(this.myChannel);
        }

        async _initAll() {
            var promiseList = [];

            promiseList.push(this.kofunManager.init());
            promiseList.push(this.shrineManager.init());
            promiseList.push(this.nearbyManager.init());
            promiseList.push(this.museumManager.init());
            promiseList.push(this.landmarkManager.init());
            promiseList.push(this.descManager.init());

            await Promise.all(promiseList);
        }

        settingMyChannel(myChannel) {
        }

    };

}(this));
