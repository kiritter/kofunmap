(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerNearbyManager = class MarkerNearbyManager {
        constructor(gaChannel, mapBoth, globalState) {
            this.gaChannel = gaChannel;
            this.mapBoth = mapBoth;
            this.globalState = globalState;

            this.list = [
                {timeRangeType: MyApp.globalState.const.TIME_RANGE_TYPE_YUSHI, url: 'geojson/10_path_point_event/01a_point_list.geojson'},
            ];

            this.coreManagerByKey = this._createCoreManagerMap();
        }

        _createCoreManagerMap() {
            var coreManagerByKey = new Map();
            var self = this;
            this.list.forEach((el) => {
                var coreManager = self._createCoreManager(el.timeRangeType, el.url);
                coreManagerByKey.set(`${el.timeRangeType}`, coreManager);
            });
            return coreManagerByKey;
        }
        _createCoreManager(targetTimeRangeType, targetUrl) {
            var layerName = 'layer_spot_main';
            var callbacks = {
                'tooltipContentCallback': MarkerNearbyManager._buildTooltipContent,
                'popupContentCallback': null,
                'filterGeojsonPredicate': MarkerNearbyManager._filterGeojsonPredicate,
            };
            var options = {
                shouldCircleMarker: false,
                circleMarkerColNames: null,
                shouldTooltip: true,
                tooltipNames: {className: 'tooltip-nearby', geZoom: 'nearbyPointTooltipGeZoom', direction: 'nearbyPointTooltipDirection'},
                shouldPopup: false,
                popupNames: null,
                isCustomIconMarker: true,
                customIconUrl: 'images/nearby_point.png',
            };
            var coreManager = new MyApp.MarkerCoreManager(this.gaChannel, this.mapBoth, this.globalState, layerName, callbacks, options, targetTimeRangeType, targetUrl);
            return coreManager;
        }

        async init() {
            var promiseList = [];
            for (var [key, coreManager] of this.coreManagerByKey) {
                promiseList.push(coreManager.init());
            }
            await Promise.all(promiseList);
        }

        static _buildTooltipContent(properties) {
            var content = `
<div>
    <div class="tooltip-nearby-name">${properties.nearbyPointName}</div>
</div>
`;
            return content;
        }

        static _buildPopupContent(properties) {
            var content = `
`;
            return content;
        }

        static _filterGeojsonPredicate(properties) {
            if (properties.isNearbyPoint === true) {
                return true;
            }
            return false;
        }

        redraw(selectedTimeRangeType) {
            for (var [key, coreManager] of this.coreManagerByKey) {
                coreManager.clearLayers();
            }

            var currentTimeRangeType = selectedTimeRangeType;
            var targetCoreManager = this.coreManagerByKey.get(`${currentTimeRangeType}`);
            targetCoreManager.redrawLayers();
        }

    };

}(this));
