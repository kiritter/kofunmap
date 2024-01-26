(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UrlCopyManager = class UrlCopyManager {
        constructor(gaChannel, mapBoth, globalState, urlRepo, seaSurfaceManager, clickManager, navigator) {
            this.gaChannel = gaChannel;
            this.mapLeft = mapBoth.mapLeft;
            this.globalState = globalState;
            this.urlRepo = urlRepo;
            this.seaSurfaceManager = seaSurfaceManager;
            this.clickManager = clickManager;
            this.window_navigator = navigator;
        }

        init() {
            this.settingBtn();
        }

        settingBtn() {
            var btnEl = document.querySelector('.js-copy-as-url-btn');

            var self = this;
            btnEl.addEventListener('click', function() {
                btnEl.disabled = true;

                var zoom = self.mapLeft.getZoom();
                var centerLeft = self.mapLeft.getCenter();
                var leftLayerNames = self.getSelectedLayerNames('.js-map-left-wrap');
                var seaSurfaceHeight = self.seaSurfaceManager.getSeaSurfaceHeight();
                var includesCircleLatlng = self.includesCircleLatlng();
                var distanceMarkerCenterLeft = self.clickManager.getCurrentLatlngLeft();
                var url = self.buildUrlText(
                    zoom, centerLeft,
                    leftLayerNames, seaSurfaceHeight,
                    includesCircleLatlng, distanceMarkerCenterLeft
                );

                console.info(`現在場所のURL[${url}]`);

                if (self.window_navigator.clipboard) {
                }else{
                    self.showApiNothingMessage()
                    btnEl.disabled = false;
                    self.gaChannel.publish('copy_url_api_nothing');
                    return;
                }

                self.window_navigator.clipboard.writeText(url)
                    .then(() => {
                        self.showMessage();
                        btnEl.disabled = false;
                        self.gaChannel.publish('copy_url');
                    })
                    .catch((err) => {
                        self.showCancelOrErrorMessage();
                        btnEl.disabled = false;
                        var errorText = err.toString();
                        self.gaChannel.publishError('copy_url_cancel_or_error', errorText);
                    });
            }, false);
        }

        getSelectedLayerNames(mapWrapClassName) {
            var selectedNameList = [];
            var overlaysArea = document.querySelector(`${mapWrapClassName} .leaflet-control-layers .leaflet-control-layers-overlays`);
            var targetList = overlaysArea.querySelectorAll(`input[type="checkbox"]`);
            targetList.forEach(function(target) {
                if (target.checked) {
                    var layerName = target.getAttribute('data-layer-name');
                    selectedNameList.push(layerName);
                }
            });
            return selectedNameList;
        }

        includesCircleLatlng() {
            var checkEl = document.querySelector('.js-copy-as-url-chk');
            if (checkEl.checked) {
                return true;
            }
            return false;
        }

        buildUrlText(
            zoom, centerLeft,
            leftLayerNames, seaSurfaceHeight,
            includesCircleLatlng, distanceMarkerCenterLeft
        ) {
            var appUrlPart = this.urlRepo.getAppUrlPart();

            var lng = centerLeft.lng;
            var lat = centerLeft.lat;

            var lefts = '';
            leftLayerNames.forEach(function(name) {
                lefts += `&left=${name}`
            });

            var height = '';
            if (leftLayerNames.includes('dem5a') || rightLayerNames.includes('dem5a')) {
                height += `&height=${seaSurfaceHeight}`;
            }

            var dclng = '';
            var dclat = '';
            if (includesCircleLatlng) {
                if (distanceMarkerCenterLeft) {
                    dclng += `&dclng=${distanceMarkerCenterLeft.lng}`;
                    dclat += `&dclat=${distanceMarkerCenterLeft.lat}`;
                }
            }

            var url = `${appUrlPart}?z=${zoom}&lng=${lng}&lat=${lat}${dclng}${dclat}${lefts}${height}`;
            return url;
        }

        showMessage(messageText) {
            var messageText = 'コピーしました。';
            var messageEl = document.querySelector('.js-copy-as-url-message');
            messageEl.innerText = messageText;
            var timerId = setTimeout(function() {
                clearTimeout(timerId);
                messageEl.innerText = '';
            }, 1000);
        }

        showApiNothingMessage() {
            alert(`クリップボードコピー用APIが存在しないため、コピーできませんでした。\nご利用環境がPCの場合、F12キーで開く開発者ツールのConsoleに出力しているため、それをご利用ください。`);
        }

        showCancelOrErrorMessage() {
            alert(`クリップボードにコピーできませんでした。\nご利用環境がPCの場合、F12キーで開く開発者ツールのConsoleに出力しているため、それをご利用ください。`);
        }

    };

}(this));
