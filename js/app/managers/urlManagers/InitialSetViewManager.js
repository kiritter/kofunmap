(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.InitialSetViewManager = class InitialSetViewManager {
        constructor(gaChannel, mapBoth, globalState, urlQueryParamRepo, seaSurfaceManager, clickManager) {
            this.gaChannel = gaChannel;
            this.mapBoth = mapBoth;
            this.mapLeft = mapBoth.mapLeft;
            this.globalState = globalState;
            this.urlQueryParamRepo = urlQueryParamRepo;
            this.seaSurfaceManager = seaSurfaceManager;
            this.clickManager = clickManager;
        }

        createWith(urlQueryParamRepo) {
            var created = new InitialSetViewManager(this.gaChannel, this.mapBoth, this.globalState, urlQueryParamRepo, this.seaSurfaceManager, this.clickManager);
            return created;
        }

        init(isRecommendShow) {
            if (this.urlQueryParamRepo.hasAnyQueryParams() === false) {
                return;
            }

            var urlNormalizer = new MyApp.UrlNormalizer();
            this.urlQueryParamRepo = urlNormalizer.normalize(this.urlQueryParamRepo);

            var urlValidator = new MyApp.UrlValidator();
            var isValid = urlValidator.isValid(this.urlQueryParamRepo);
            if (isValid === false) {
                console.warn('URLが正しくありません');
                if (isRecommendShow) {
                }else{
                    this.gaChannel.publish('view_with_query_params_invalid');
                }
                return;
            }

            if (isRecommendShow) {
            }else{
                this.gaChannel.publish('view_with_query_params');
            }

            this.settingSeaSurfaceHeight();
            this.settingLayer();
            this.settingMap();
            this.settingDistanceMarker();
        }

        settingSeaSurfaceHeight() {
            var seaSurfaceHeight = this.urlQueryParamRepo.getQueryValueBy('height');
            if (seaSurfaceHeight) {
                this.seaSurfaceManager.setSeaSurfaceHeight(seaSurfaceHeight);
            }
        }

        settingLayer() {
            this._setAllLayerOff('.js-map-left-wrap');
            this._setTargetLayerOn('left', '.js-map-left-wrap');
        }
        _setAllLayerOff(mapWrapClassName) {
            var overlaysArea = document.querySelector(`${mapWrapClassName} .leaflet-control-layers .leaflet-control-layers-overlays`);
            var targetList = overlaysArea.querySelectorAll(`input[type="checkbox"]`);
            targetList.forEach(function(target) {
                if (target.checked) {
                    target.click();
                }
            });
        }
        _setTargetLayerOn(mapQueryName, mapWrapClassName) {
            var layerNames = this.urlQueryParamRepo.getQueryValueBy(mapQueryName);
            if (Array.isArray(layerNames) === false) {
                layerNames = [layerNames];
            }
            var overlaysArea = document.querySelector(`${mapWrapClassName} .leaflet-control-layers .leaflet-control-layers-overlays`);
            layerNames.forEach(function(layerName) {
                var target = overlaysArea.querySelector(`input[type="checkbox"][data-layer-name="${layerName}"]`);
                if (target) {
                    if (target.checked === false) {
                        target.click();
                    }
                }
            });
        }

        settingMap() {
            var zoom = this.urlQueryParamRepo.getQueryValueBy('z');

            var lat = this.urlQueryParamRepo.getQueryValueBy('lat');
            var lng = this.urlQueryParamRepo.getQueryValueBy('lng');
            var centerLeft = L.latLng(lat, lng);

            this._setViewForStandard(zoom, centerLeft);
        }

        _setViewForStandard(zoom, centerLeft) {
            var options = {
                animate: false,
                duration: 0.25,
            };
            this.mapLeft.setView(centerLeft, zoom, options);

        }

        settingDistanceMarker() {
            var dclat = this.urlQueryParamRepo.getQueryValueBy('dclat');
            var dclng = this.urlQueryParamRepo.getQueryValueBy('dclng');
            if (dclat && dclng) {
            }else{
                return;
            }
            var dclatLng = L.latLng(dclat, dclng);

            this.clickManager.showLatLngInfoAndCircles(dclatLng, dclatLng);
        }

    };

}(this));
