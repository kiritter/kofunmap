(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.ClickManagerCore = class ClickManagerCore {
        constructor(map, cssClassNameSuffix, myChannel, distanceCircleFactory, oldEditionMapIdRepo) {
            this.map = map;
            this.cssClassNameSuffix = cssClassNameSuffix;
            this.myChannel = myChannel;
            this.distanceCircleFactory = distanceCircleFactory;
            this.oldEditionMapIdRepo = oldEditionMapIdRepo;

            this.layerGroup = L.layerGroup();
            this.historyList = [];
            this.centerLatlngHistoryList = [];
        }

        init() {
            this.settingMap();
            this.settingClickEvent();
            this.settingZoomEvent();
        }

        settingMap() {
            this.layerGroup.addTo(this.map);
        }

        settingClickEvent() {
            var self = this;
            this.map.on('click', function(mouseEvent) {
                var selectedLatLng = mouseEvent.latlng;
                self.showLatLngInfoAndCircles(selectedLatLng);
                self.showOldMapIdCsv(selectedLatLng);
                self._publish(selectedLatLng);
            });
        }

        settingZoomEvent() {
            var self = this;
            this.map.on('zoomend', function(event) {
                var currentZoom = event.target.getZoom();

                var lastGroup = self.historyList[self.historyList.length - 1];
                if (lastGroup) {
                    lastGroup._mySwitchAdding(currentZoom);
                }
            });
        }

        getCurrentLatlng() {
            var len = this.centerLatlngHistoryList.length;
            if (len > 0) {
                var currentCenter = this.centerLatlngHistoryList[len - 1];
                return currentCenter;
            }
            return undefined;
        }

        showLatLngInfoAndCircles(selectedLatLng) {
            this.showLatLngInfo(selectedLatLng);
            this.showGroup(selectedLatLng);
        }

        showLatLngInfo(selectedLatLng) {
            var latlngText = `Lat(緯度),Lng(経度) [${selectedLatLng.lat}, ${selectedLatLng.lng}] GeoJSON用[${selectedLatLng.lng}, ${selectedLatLng.lat}]`;
            var areaRootEl = document.querySelector(`.js-latlng-info-area-${this.cssClassNameSuffix}`);
            var label1El = areaRootEl.querySelector('.js-show-latlng-label');
            label1El.innerText = `[${selectedLatLng.lat}, ${selectedLatLng.lng}]`;
            var label2El = areaRootEl.querySelector('.js-show-lnglat-label');
            label2El.innerText = `[${selectedLatLng.lng}, ${selectedLatLng.lat}]`;
        }

        showGroup(selectedLatLng) {
            this._hiddenLastGroup();

            var center = L.latLng(selectedLatLng.lat, selectedLatLng.lng);
            var groupObj = this.distanceCircleFactory.createCurrentGroup(center);

            var currentZoom = this.map.getZoom();
            this._showCurrentGroup(
                center, currentZoom,
                groupObj.baseGroupAsArray, groupObj.addingGroupAsArrayByGeZoom
            );
        }

        _hiddenLastGroup() {
            var lastGroup = this.historyList[this.historyList.length - 1];
            if (lastGroup) {
                this.layerGroup.removeLayer(lastGroup);
            }

            this._cleanupHistory();
        }

        _cleanupHistory() {
            const ACTIVE_NUM = 10;
            const LIMIT_NUM = 20;
            var len = this.historyList.length;
            if (len > LIMIT_NUM) {
                var removeNum = len - ACTIVE_NUM;
                this.historyList.splice(0, removeNum);
                this.centerLatlngHistoryList.splice(0, removeNum);
            }
        }

        _showCurrentGroup(center, currentZoom, baseGroupAsArray, addingGroupAsArrayByGeZoom) {
            this.centerLatlngHistoryList.push(center);
            var group = L.layerGroup.withAdding(baseGroupAsArray);
            group._myWithAdding(currentZoom, addingGroupAsArrayByGeZoom);
            this.layerGroup.addLayer(group);
            this.historyList.push(group);
        }

        async showOldMapIdCsv(selectedLatLng) {
            var mapIdCsvText = await this._buildOldEditionMapIdCsv(selectedLatLng);
        }

        async _buildOldEditionMapIdCsv(selectedLatLng) {
            var z = this.map.getZoom();
            var tileXYInfo = MyApp.UtilCalcForTile.calcTileXYFromLatlng(this.map, z, selectedLatLng);
            var existsCache = await this.oldEditionMapIdRepo.exists(z, tileXYInfo.x, tileXYInfo.y);
            if (existsCache) {
                var mapIdCsv = await this.oldEditionMapIdRepo.findBy(z, tileXYInfo.x, tileXYInfo.y);
                return `mapIdCsv[${mapIdCsv}]`;
            }else{
                return new Promise(function(resolve, reject) {
                    resolve(`mapIdCsv[(未描画)]`);
                });
            }
        }

        getTopicName() {
            var prefix = 'circleManager/clickedOn';
            var first = this.cssClassNameSuffix.substring(0, 1).toUpperCase();
            var remain = this.cssClassNameSuffix.substring(1);
            return `${prefix}${first}${remain}`;
        }

        _publish(selectedLatLng) {
            var topicName = this.getTopicName();
            var options = {
                selectedLatLng: selectedLatLng,
            };
            this.myChannel.publish(topicName, options);
        }

    };

}(this));
