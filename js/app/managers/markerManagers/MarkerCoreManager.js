(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerCoreManager = class MarkerCoreManager {
        constructor(gaChannel, mapBoth, globalState, layerName, callbacks, options, targetTimeRangeType, targetUrl) {
            this.gaChannel = gaChannel;
            this.mapLeft = mapBoth.mapLeft;
            this.globalState = globalState;
            this.layerName = layerName;
            this.callbacks = callbacks;
            this.options = options;
            this.targetTimeRangeType = targetTimeRangeType;
            this.targetUrl = targetUrl;


            this.layerGroupLeft = L.layerGroup();
            var isAsyncPublish = true;
            this.myChannel = new MyApp.MyChannel(isAsyncPublish);

            this.geojson;
        }

        async init() {
            this.addEventListenersToMap();
            this.settingZoomEvent();

            this.geojson = await this.findPlaceData();
            var markersGroup = this.createMarkersGroup(this.geojson);
            this.layerGroupLeft.addLayer(markersGroup);
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

        settingZoomEvent() {
            var self = this;
            this.mapLeft.on('zoomend', function(event) {
                if (self.layerName === '') {
                    if (self.globalState.timeRangeType === self.targetTimeRangeType) {
                        var currentZoom = event.target.getZoom();
                        self._publishAtZoomEnd(currentZoom);
                    }
                    return;
                }

                var targetLayer = MyApp.UtilMap.findLayerByNameInActiveLayers(self.mapLeft, self.layerName);
                if (targetLayer) {
                    if (self.mapLeft.hasLayer(self.layerGroupLeft)) {
                        if (self.globalState.timeRangeType === self.targetTimeRangeType) {
                            var currentZoom = event.target.getZoom();
                            self._publishAtZoomEnd(currentZoom);
                        }
                    }
                }
            });
        }

        _publishAtZoomEnd(currentZoom) {
            var topicName = 'zoomEnd';
            var options = {
                currentZoom: currentZoom,
            };
            this.myChannel.publish(topicName, options);
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

        createMarkersGroup(geoJson) {
            var tooltipFunc = this._createTooltipContentFunc();
            var popupFunc = this._createPopupContentFunc();

            var self = this;
            var markerOptions = {
                filter: (feature) => {
                    var isTargetByType = (feature.geometry.type === 'Point' && feature.properties.subType === 'Location') ? true : false;
                    var isTargetByProp = true;
                    if (self.callbacks.filterGeojsonPredicate) {
                        isTargetByProp = self.callbacks.filterGeojsonPredicate(feature.properties);
                    }
                    return isTargetByType && isTargetByProp;
                },
                onEachFeature: (feature, layer) => {

                    if (self.options.popupNames && self.options.popupNames.zIndexOffset && feature.properties[self.options.popupNames.zIndexOffset]) {
                        var zIndexOffset = feature.properties[self.options.popupNames.zIndexOffset];
                        layer.setZIndexOffset(zIndexOffset);
                    }

                    if (self.options.shouldTooltip) {
                        var tooltipOptions;
                        if (self.options.shouldCircleMarker) {
                            tooltipOptions = self._createTooltipOptionForCircleMarker(feature.properties, self.options.tooltipNames);
                        }else{
                            if (self.options.isNoIconMarker) {
                                tooltipOptions = self._createTooltipOptionForNoIcon(feature.properties, self.options.tooltipNames);
                            }else if (self.options.isCustomIconMarker) {
                                tooltipOptions = self._createTooltipOptionForEventIcon(feature.properties, self.options.tooltipNames);
                            }else{
                                tooltipOptions = self._createTooltipOptionForMarker(feature.properties, self.options.tooltipNames);
                            }
                        }
                        layer.bindTooltip(tooltipFunc, tooltipOptions);
                    }

                    if (self.options.shouldPopup) {
                        var popupOptions = self._createPopupOption(feature.properties, self.options.popupNames, self.options.popupOptionValues);
                        layer.bindPopup(popupFunc, popupOptions);
                    }

                    layer.on('add', function(event) {
                        if (self.options.shouldTooltip) {
                            var currentZoom = self.mapLeft.getZoom();
                            var geZoom = (feature.properties[self.options.tooltipNames.geZoom]) ? feature.properties[self.options.tooltipNames.geZoom] : 0;
                            if (currentZoom >= geZoom) {
                                if (layer.isTooltipOpen() === false) {
                                    layer.openTooltip();
                                }
                            }else{
                                if (layer.isTooltipOpen()) {
                                    layer.closeTooltip();
                                }
                            }
                        }
                    });

                    if (self.gaChannel !== null) {
                        var resourceIdColName = self.options.resourceIdColName;
                        var resourceId = feature.properties[resourceIdColName];
                        layer.on('click', function(event) {
                            self.gaChannel.publishForData(`marker_${resourceId}`);
                        });
                    }

                    var topicName = 'zoomEnd';
                    self.myChannel.subscribe(topicName, function(topicName, options) {
                        if (self.options.shouldTooltip) {
                            var currentZoom = options.currentZoom;
                            var geZoom = (feature.properties[self.options.tooltipNames.geZoom]) ? feature.properties[self.options.tooltipNames.geZoom] : 0;
                            if (currentZoom >= geZoom) {
                                if (layer.isTooltipOpen() === false) {
                                    layer.openTooltip();
                                }
                            }else{
                                if (layer.isTooltipOpen()) {
                                    layer.closeTooltip();
                                }
                            }
                        }
                    });

                },
            };

            if (this.options.shouldCircleMarker) {
                markerOptions['pointToLayer'] = (geoJsonPoint, latlng) => {
                    return L.circleMarker(latlng, {
                        radius: geoJsonPoint.properties[this.options.circleMarkerColNames.radius],
                        color: geoJsonPoint.properties[this.options.circleMarkerColNames.color],
                        fill: geoJsonPoint.properties[this.options.circleMarkerColNames.isFill],
                        fillColor: geoJsonPoint.properties[this.options.circleMarkerColNames.color],
                        fillOpacity: 1.0,
                    });
                };
            }else{
                if (this.options.isNoIconMarker) {
                    var dummyIcon = L.icon({
                        iconUrl: 'images/nofill_16px_rgb0_0_0.png',
                        iconSize: [16, 16],
                        iconAnchor: [8, 16],
                        tooltipAnchor: [0, 0],
                    });
                    markerOptions['pointToLayer'] = (geoJsonPoint, latlng) => {
                        return L.marker(latlng, {
                            icon: dummyIcon,
                            opacity: 0.0,
                        });
                    };
                }else if (this.options.isCustomIconMarker) {
                    var iconUrl = this.options.customIconUrl;
                    var customIcon = L.icon({
                        iconUrl: iconUrl,
                        iconSize: [24, 24],
                        iconAnchor: [12, 24],
                        tooltipAnchor: [0, 0],
                    });
                    markerOptions['pointToLayer'] = (geoJsonPoint, latlng) => {
                        return L.marker(latlng, {
                            icon: customIcon,
                        });
                    };
                }
            }

            var markersGroup = L.geoJSON(geoJson, markerOptions);
            return markersGroup;
        }

        _createTooltipOptionForMarker(properties, tooltipNames) {
            return {
                permanent: true,
                direction: properties[tooltipNames.direction],
                className: tooltipNames.className,
                offset: MyApp.UtilLeafletTooltip.calcTooltipOffsetForMarker(properties[tooltipNames.direction]),
            };
        }
        _createTooltipOptionForCircleMarker(properties, tooltipNames) {
            return {
                permanent: true,
                direction: properties[tooltipNames.direction],
                className: tooltipNames.className,
                offset: MyApp.UtilLeafletTooltip.calcTooltipOffsetForCircleMarker(properties[tooltipNames.direction]),
            };
        }
        _createTooltipOptionForNoIcon(properties, tooltipNames) {
            return {
                permanent: true,
                direction: properties[tooltipNames.direction],
                className: tooltipNames.className,
                offset: MyApp.UtilLeafletTooltip.calcTooltipOffsetForNoIcon(properties[tooltipNames.direction]),
            };
        }
        _createTooltipOptionForEventIcon(properties, tooltipNames) {
            return {
                permanent: true,
                direction: properties[tooltipNames.direction],
                className: tooltipNames.className,
                offset: MyApp.UtilLeafletTooltip.calcTooltipOffsetForEventIcon(properties[tooltipNames.direction]),
            };
        }
        _createTooltipContentFunc() {
            var self = this;
            return (layer) => {
                var content;
                if (self.callbacks.tooltipContentCallback) {
                    content = self.callbacks.tooltipContentCallback(layer.feature.properties);
                }else{
                    content = self._buildTooltipContentDefault(layer.feature.properties);
                }
                return content;
            };
        }

        _createPopupOption(properties, popupNames, popupOptionValues) {
            return {
                className: popupNames.className,
                maxWidth: (popupOptionValues && popupOptionValues.maxWidth) ? popupOptionValues.maxWidth : 380,
            };
        }
        _createPopupContentFunc() {
            var self = this;
            return (layer) => {
                var content;
                if (self.callbacks.popupContentCallback) {
                    content = self.callbacks.popupContentCallback(layer.feature.properties);
                }else{
                    content = self._buildPopupContentDefault(layer.feature.properties);
                }
                return content;
            };
        }

        _buildTooltipContentDefault(properties) {
            var name = properties.name;
            var desc = properties.desc;
            var contentNormal = `
<p style="margin-bottom:10px;">${name}</p>
<p style="margin:0;">${desc}</p>
`;
            return contentNormal;
        }
        _buildPopupContentDefault(properties) {
            var name = properties.name;
            var desc = properties.desc;
            var contentNormal = `
<p style="margin-bottom:10px;">${name}</p>
<p style="margin:0;">${desc}</p>
`;
            return contentNormal;
        }

    };

}(this));
