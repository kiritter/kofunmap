(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UtilCircle = class UtilCircle {
        constructor() {
        }


        static calcTargetLatLngBy(center, radius) {
            var degree = 15;
            var targetLatLng = L.GeometryUtil.destination(center, degree, radius);
            return targetLatLng;
        }

    };

}(this));
