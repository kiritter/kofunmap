(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerKofunManager = class MarkerKofunManager {
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
            var layerName = `layer_kofun`;
            var callbacks = {
                'tooltipContentCallback': null,
                'popupContentCallback': MarkerKofunManager._buildPopupContent,
                'filterGeojsonPredicate': MarkerKofunManager._filterGeojsonPredicate,
            };
            var options = {
                shouldCircleMarker: false,
                circleMarkerColNames: null,
                shouldTooltip: false,
                tooltipNames: null,
                shouldPopup: true,
                popupNames: {className: 'popup-kofun', zIndexOffset: 'kofunPointZIndexOffset'},
                popupOptionValues: {maxWidth: 390},
                resourceIdColName: 'kofunPointGaResourceId',
                isCustomIconMarker: false,
                customIconUrl: '',
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
`;
            return content;
        }

        static _buildPopupContent(properties) {
            var content = `
<div>
  <div class="kofun-name">${properties.kofunPointName}</div>
  <div class="kofun-desc">${properties.kofunPointDesc}</div>
</div>
`;
            return content;
        }

        static _filterGeojsonPredicate(properties) {
            if (properties.isKofunPoint === true) {
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
