(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UrlNormalizer = class UrlNormalizer {
        constructor() {
        }

        normalize(urlQueryParamRepo) {
            var clone = urlQueryParamRepo.getClone();
            if (this._hasRequiredParams(urlQueryParamRepo)) {
                MyApp.UtilDeepFreeze.execute(clone);
                return clone;
            }
            this._addRequiredParamsTo(clone);
            MyApp.UtilDeepFreeze.execute(clone);
            return clone;
        }

        _hasRequiredParams(urlQueryParamRepo) {
            var zoom = urlQueryParamRepo.getQueryValueBy('z');
            var lat = urlQueryParamRepo.getQueryValueBy('lat');
            var lng = urlQueryParamRepo.getQueryValueBy('lng');
            if (zoom && lat && lng) {
                return true;
            }
            return false;
        }

        _addRequiredParamsTo(urlQueryParamRepo) {
            var zoom = urlQueryParamRepo.getQueryValueBy('z');
            var lat = urlQueryParamRepo.getQueryValueBy('lat');
            var lng = urlQueryParamRepo.getQueryValueBy('lng');

            if (zoom === undefined) {
                var initialZoomLevel = MyApp.UtilMap.getInitialZoomLevel();
                urlQueryParamRepo.addQueryKeyValue('z', initialZoomLevel);
            }
            if (lat === undefined || lng === undefined) {
                var initialCenter = MyApp.UtilMap.getInitialCenter();
                urlQueryParamRepo.addQueryKeyValue('lat', initialCenter.lat);
                urlQueryParamRepo.addQueryKeyValue('lng', initialCenter.lng);
            }
        }

    };

}(this));
