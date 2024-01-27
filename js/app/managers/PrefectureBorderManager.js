(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.PrefectureBorderManager = class PrefectureBorderManager {
        constructor(gaChannel, mapBoth, globalState, myChannel) {
            this.globalState = globalState;
            this.myChannel = myChannel;

            var isLazyLoad = true;
            this.allManager = new MyApp.EachPolygonManager(gaChannel, mapBoth, globalState, 'pref_border', 'geojson/11_prefecture_borders/prefectures.geojson', isLazyLoad);
        }

        async init() {
            await this._initAll();


            this.settingMyChannel(this.myChannel);
        }

        async _initAll() {
            var promiseList = [];

            promiseList.push(this.allManager.init());

            await Promise.all(promiseList);
        }

        settingMyChannel(myChannel) {
        }

    };

}(this));
