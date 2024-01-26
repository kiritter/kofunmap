(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UtilMap = class UtilMap {
        constructor() {
        }

        static getZoomLevelMinMax() {
            var minZoom = 6;
            var maxZoom = 18;
            return {minZoom: minZoom, maxZoom: maxZoom};
        }
        static getInitialZoomLevel() {
            var initZoom = 6;
            return initZoom;
        }

        static getInitialCenter() {
            var center = L.latLng(36.0622222, 135.7313889);
            return center;
        }

        static getLimitMapBounds() {

            var northWest = L.latLng(50.597186230587035, 106.34765625000001);
            var southEast = L.latLng(16.636191878397664, 171.12304687500003);
            var limitMapBounds = L.latLngBounds(northWest, southEast);
            return limitMapBounds;
        }

        static isWithinLimitMapBounds(targetLatLng) {
            var limitMapBounds = UtilMap.getLimitMapBounds();
            var contains = limitMapBounds.contains(targetLatLng);
            return contains;
        }

        static findLayerByNameInActiveLayers(map, layerName) {
            var list = UtilMap.findAllActiveLayers(map);
            var len = list.length;
            for (var i = 0; i < len; i++) {
                if (list[i].options.myLayerName === layerName) {
                    return list[i];
                }
            }
            return null;
        }

        static findAllActiveLayers(map) {
            var list = [];
            map.eachLayer((layer) => {
                if (layer instanceof L.GridLayer) {
                    list.push(layer);
                }
            });
            return list;
        }
        
    };

}(this));
