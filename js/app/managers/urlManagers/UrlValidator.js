(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UrlValidator = class UrlValidator {
        constructor() {
        }

        isValid(urlQueryParamRepo) {
            var zoom = urlQueryParamRepo.getQueryValueBy('z');
            if (this._isValidZoom(zoom) === false) {
                return false;
            }
            var lat = urlQueryParamRepo.getQueryValueBy('lat');
            var lng = urlQueryParamRepo.getQueryValueBy('lng');
            if (this._isValidLatLngRequired(lat, lng) === false) {
                return false;
            }
            var dclat = urlQueryParamRepo.getQueryValueBy('dclat');
            var dclng = urlQueryParamRepo.getQueryValueBy('dclng');
            if (this._isValidLatLngOptional(dclat, dclng) === false) {
                return false;
            }
            var height = urlQueryParamRepo.getQueryValueBy('height');
            if (this._isValidHeight(height) === false) {
                return false;
            }
            var left = urlQueryParamRepo.getQueryValueBy('left');
            if (this._isValidLeft(left) === false) {
                return false;
            }
            return true;
        }

        _isValidZoom(zoom) {
            if (zoom) {
                if (MyApp.UtilNumber.isValidZoomNumber(zoom)) {
                    return true;
                }
            }
            return false;
        }

        _isValidLatLngRequired(lat, lng) {
            if (lat && lng) {
                if (this._isValidLatLngCore(lat, lng)) {
                    return true;
                }
            }
            return false;
        }
        _isValidLatLngOptional(lat, lng) {
            if (lat === undefined && lng === undefined) {
                return true;
            }
            if (lat && lng) {
                if (this._isValidLatLngCore(lat, lng)) {
                    return true;
                }
            }
            return false;
        }
        _isValidLatLngCore(lat, lng) {
            if (MyApp.UtilNumber.isDecimalNumber(lat) && MyApp.UtilNumber.isDecimalNumber(lng)) {
                var latF = parseFloat(lat, 10);
                if (-90 <= latF && latF <= 90) {
                    var lngF = parseFloat(lng, 10);
                    if (-180 <= lngF && lngF <= 180) {
                        return true;
                    }
                }
            }
            return false;
        }

        _isValidHeight(height) {
            if (height === undefined) {
                return true;
            }
            if (this.isValidHeightCore(height)) {
                return true;
            }
            return false;
        }
        isValidHeightCore(height) {
            if (height) {
                if (MyApp.UtilNumber.isDecimalNumber(height)) {
                    var heightDec = parseFloat(height, 10);
                    if (0 <= heightDec && heightDec <= 30) {
                        return true;
                    }
                }
            }
            return false;
        }

        _isValidLeft(left) {
            return true;
        }

    };

}(this));
