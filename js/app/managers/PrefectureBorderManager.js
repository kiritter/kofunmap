(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.PrefectureBorderManager = class PrefectureBorderManager {
        constructor(mapBoth, globalState, myChannel) {
            this.globalState = globalState;
            this.myChannel = myChannel;

            this.allManager = new MyApp.EachPolygonManager(mapBoth, globalState, 'pref_border', 'geojson/11_prefecture_borders/prefectures.geojson');
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
