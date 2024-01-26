(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerRecommendCoreManager = class MarkerRecommendCoreManager {
        constructor(gaChannel, mapBoth, layerName, url, contentCallback, options) {
            this.gaChannel = gaChannel;
            this.mapLeft = mapBoth.mapLeft;
            this.layerGroupLeft = L.layerGroup();
            this.layerName = layerName;
            this.url = url;
            this.contentCallback = contentCallback;
            this.options = options;
        }

        async init() {
            this.addEventListenersToMap();

            var placeGeoJson = await this.findRecommendPlaceData();
            this.settingMarkers(placeGeoJson);
        }

        addEventListenersToMap() {
            var self = this;
            this.mapLeft.on('overlayadd', function(layersControlEvent) {
                var targetLayer = MyApp.UtilMap.findLayerByNameInActiveLayers(self.mapLeft, self.layerName);
                if (targetLayer) {
                    if (self.mapLeft.hasLayer(self.layerGroupLeft) === false) {
                        self.layerGroupLeft.addTo(self.mapLeft);
                    }
                }else{
                }
            });
            this.mapLeft.on('overlayremove', function(layersControlEvent) {
                var targetLayer = MyApp.UtilMap.findLayerByNameInActiveLayers(self.mapLeft, self.layerName);
                if (targetLayer) {
                }else{
                    if (self.mapLeft.hasLayer(self.layerGroupLeft)) {
                        self.layerGroupLeft.removeFrom(self.mapLeft);
                    }
                }
            });
        }

        async findRecommendPlaceData() {
            var res = await fetch(this.url);
            return res.json();
        }

        settingMarkers(geoJson) {
            var self = this;

            var options = {
                filter: (feature) => {
                    return (feature.geometry.type === 'Point' && feature.properties.subType === 'Location') ? true : false;
                },
                onEachFeature: (feature, layer) => {
                    if (feature.properties.zIndexOffset) {
                        layer.setZIndexOffset(feature.properties.zIndexOffset);
                    }
                    layer.on('click', function(event) {
                        self.gaChannel.publishForData(`marker_${feature.properties.placeId}`);
                    });
                },
            };

            if (this.options && this.options.markerClassName) {
                options['pointToLayer'] = (geoJsonPoint, latlng) => {
                    var icon = new L.Icon.Default();
                    icon.options.className = self.options.markerClassName;
                    var markerOptions = {
                        icon: icon,
                    };
                    var marker = L.marker(latlng, markerOptions);
                    return marker;
                };
            }

            var popupOptions = {
            };
            var popupFunc = (layer) => {
                var content;
                if (self.contentCallback) {
                    content = self.contentCallback(layer.feature.properties);
                }else{
                    content = self._buildMarkerPopupContentDefault(layer.feature.properties);
                }
                return content;
            };
            this._createMarkerCore(geoJson, options, popupFunc, popupOptions);
        }

        _buildMarkerPopupContentDefault(properties) {
            var name = properties.name;
            var desc = properties.desc;
            var contentNormal = `
<p style="margin-bottom:10px;">${name}</p>
<p style="margin:0;">${desc}</p>
`;
            return contentNormal;
        }

        _createMarkerCore(geoJson, options, popupFunc, popupOptions) {
            var markers = L.geoJSON(geoJson, options);
            markers.bindPopup(popupFunc, popupOptions);
            this.layerGroupLeft.addLayer(markers);
        }

    };

}(this));
