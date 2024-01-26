(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.PolygonCoreManager = class PolygonCoreManager {
        constructor(mapBoth, globalState, layerName, callbacks, options, targetTimeRangeType, targetUrl) {
            this.mapLeft = mapBoth.mapLeft;
            this.globalState = globalState;
            this.layerName = layerName;
            this.callbacks = callbacks;
            this.options = options;
            this.targetTimeRangeType = targetTimeRangeType;
            this.targetUrl = targetUrl;

            this.layerGroupLeft = L.layerGroup();

            this.geojson;
        }

        async init() {
            this.addEventListenersToMap();

            this.geojson = await this.findPlaceData();
            var polygonsGroup = this.createPolygonsGroup(this.geojson);
            this.layerGroupLeft.addLayer(polygonsGroup);
        }

        addEventListenersToMap() {
            if (this.layerName === '') {
                if (this.globalState.timeRangeType === this.targetTimeRangeType) {
                    this.layerGroupLeft.addTo(this.mapLeft);
                }
                return;
            }

            var self = this;
            this.mapLeft.on('overlayadd', function(layersControlEvent) {
                var targetLayer = MyApp.UtilMap.findLayerByNameInActiveLayers(self.mapLeft, self.layerName);
                if (targetLayer) {
                    if (self.mapLeft.hasLayer(self.layerGroupLeft) === false) {
                        if (self.globalState.timeRangeType === self.targetTimeRangeType) {
                            self.layerGroupLeft.addTo(self.mapLeft);
                        }
                    }
                }else{
                }
            });
            this.mapLeft.on('overlayremove', function(layersControlEvent) {
                var targetLayer = MyApp.UtilMap.findLayerByNameInActiveLayers(self.mapLeft, self.layerName);
                if (targetLayer) {
                }else{
                    if (self.mapLeft.hasLayer(self.layerGroupLeft)) {
                        if (self.globalState.timeRangeType === self.targetTimeRangeType) {
                            self.layerGroupLeft.removeFrom(self.mapLeft);
                        }
                    }
                }
            });
        }

        clearLayers() {
            this.layerGroupLeft.removeFrom(this.mapLeft);
        }

        redrawLayers() {
            if (this.layerName === '') {
                if (this.globalState.timeRangeType === this.targetTimeRangeType) {
                    this.layerGroupLeft.addTo(this.mapLeft);
                }
                return;
            }

            var targetLayer = MyApp.UtilMap.findLayerByNameInActiveLayers(this.mapLeft, this.layerName);
            if (targetLayer) {
                if (this.globalState.timeRangeType === this.targetTimeRangeType) {
                    this.layerGroupLeft.addTo(this.mapLeft);
                }
            }else{
            }
        }

        async findPlaceData() {
            var res = await fetch(this.targetUrl);
            return res.json();
        }

        createPolygonsGroup(geoJson) {
            var self = this;
            var markerOptions = {
                filter: (feature) => {
                    var isTargetByType = (feature.geometry.type === self.options.geometryType) ? true : false;
                    var isTargetByProp = true;
                    if (self.callbacks.filterGeojsonPredicate) {
                        isTargetByProp = self.callbacks.filterGeojsonPredicate(feature.properties);
                    }
                    return isTargetByType && isTargetByProp;
                },
                style: (feature) => ({
                    weight: self.options.weight,
                    color: self.options.color,
                    fill: false,
                }),
            };

            var polygonsGroup = L.geoJSON(geoJson, markerOptions);
            return polygonsGroup;
        }

    };

}(this));
