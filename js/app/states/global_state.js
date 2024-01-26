(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.globalState = {
        hasIndexedDbApi: false,
        timeRangeType: 1,
        seaSurfaceHeight: 2.3,
    };

    MyApp.globalState.const = {
        TIME_RANGE_TYPE_YUSHI: 1,
    };

}(this));
