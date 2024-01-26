(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.SearchLatLngManagerCore = class SearchLatLngManagerCore {
        constructor(gaChannel, map, cssClassNameSuffix, clickManagerCore, myChannel) {
            this.gaChannel = gaChannel;
            this.map = map;
            this.cssClassNameSuffix = cssClassNameSuffix;
            this.clickManagerCore = clickManagerCore;
            this.myChannel = myChannel;
        }

        init() {
            this._settingInput();
        }

        _getInputEl() {
            var areaRootEl = document.querySelector(`.js-latlng-info-area-${this.cssClassNameSuffix}`);
            var inputEl = areaRootEl.querySelector('.js-search-latlng-input');
            return inputEl;
        }

        _settingInput() {
            var inputEl = this._getInputEl();
            var self = this;
            inputEl.addEventListener('keydown', function(e) {
                if (e.keyCode === 13) {
                    var targetLatLng = self._retrieveInputValue();
                    if (!targetLatLng) {
                        return;
                    }
                    self._search(targetLatLng);
                    self._publish(targetLatLng);
                    self.gaChannel.publish(`search[${self.getTopicName()}]`);
                }
            }, false);
        }

        _retrieveInputValue() {
            var messageText = '"緯度,経度"を入力してください。\n例：35.6816, 139.7671\n(※Googleマップからコピペする用途を想定)';
            var messageText2 = '"緯度,経度"の順序で入力してください。\n例：35.6816, 139.7671\n(※Googleマップからコピペする用途を想定)';

            var inputEl = this._getInputEl();
            var strRawValue = inputEl.value;
            strRawValue = strRawValue ? strRawValue.trim() : '';
            if (!strRawValue || strRawValue.includes(',') === false) {
                var gaText = `search[${this.getTopicName()}]_invalid`;
                this.gaChannel.publishWithContent(gaText, `${gaText}_1`);
                alert(messageText);
                return;
            }
            var latlngArray = strRawValue.split(',');
            var lat = latlngArray[0].trim();
            var lng = latlngArray[1].trim();
            if (lat && lng) {
            }else{
                var gaText = `search[${this.getTopicName()}]_invalid`;
                this.gaChannel.publishWithContent(gaText, `${gaText}_2`);
                alert(messageText);
                return;
            }
            if (MyApp.UtilNumber.isDecimalNumber(lat) && MyApp.UtilNumber.isDecimalNumber(lng)) {
            }else{
                var gaText = `search[${this.getTopicName()}]_invalid`;
                this.gaChannel.publishWithContent(gaText, `${gaText}_3`);
                alert(messageText);
                return;
            }

            var latF = parseFloat(lat, 10);
            if (-90 <= latF && latF <= 90) {
            }else{
                var gaText = `search[${this.getTopicName()}]_invalid`;
                this.gaChannel.publishWithContent(gaText, `${gaText}_4`);
                alert(messageText2);
                return;
            }
            var lngF = parseFloat(lng, 10);
            if (-180 <= lngF && lngF <= 180) {
            }else{
                var gaText = `search[${this.getTopicName()}]_invalid`;
                this.gaChannel.publishWithContent(gaText, `${gaText}_5`);
                alert(messageText);
                return;
            }

            var targetLatLng = L.latLng(lat, lng);

            var isWithin = MyApp.UtilMap.isWithinLimitMapBounds(targetLatLng);
            if (isWithin === false) {
                var gaText = `search[${this.getTopicName()}]_invalid`;
                this.gaChannel.publishWithContent(gaText, `${gaText}_6`);
                alert('申し訳ございません。移動可能範囲外です。');
                return;
            }

            return targetLatLng;
        }

        _search(targetLatLng) {
            var zoom = this.map.getZoom();

            var options = {
                animate: false,
                duration: 0.25,
            };
            this.map.setView(targetLatLng, zoom, options);

            this.clickManagerCore.showLatLngInfoAndCircles(targetLatLng);
        }

        showLatLngInfoAndCircles(targetLatLng) {
            this.clickManagerCore.showLatLngInfoAndCircles(targetLatLng);
        }

        getTopicName() {
            var prefix = 'searchedOn';
            var first = this.cssClassNameSuffix.substring(0, 1).toUpperCase();
            var remain = this.cssClassNameSuffix.substring(1);
            return `${prefix}${first}${remain}`;
        }

        _publish(targetLatLng) {
            var topicName = this.getTopicName();
            var options = {
                selectedLatLng: targetLatLng,
            };
            this.myChannel.publish(topicName, options);
        }

    };

}(this));
