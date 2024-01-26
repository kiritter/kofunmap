(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.PermanentCacheManager = class PermanentCacheManager {
        constructor(gaChannel, globalState, permanentCacheStatusRepo, navigator, location) {
            this.gaChannel = gaChannel;
            this.hasIndexedDbApi = globalState.hasIndexedDbApi;
            this.permanentCacheStatusRepo = permanentCacheStatusRepo;
            this.window_navigator = navigator;
            this.window_location = location;
            this.origin = this.window_location.origin;
        }

        init() {
            this.showOrigin();
            this.showStatusArea();
            this.settingEventHandlerToBtn();
        }

        showOrigin() {
            var originEl = document.querySelector('.js-permanent-cache-origin');
            originEl.innerText = this.origin;
        }

        async showStatusArea() {
            try {
                var cacheType = await this.permanentCacheStatusRepo.findCacheType();
                this.showCurrentStatus(cacheType);
                this.settingBtnArea(cacheType);
            } catch(err) {
                alert(`現在状態の取得に失敗しました。[${err.toString()}]`);
            }
        }

        async findCurrentCacheType() {
            try {
                var cacheType = await this.permanentCacheStatusRepo.findCacheType();
                return cacheType;
            } catch(err) {
                alert(`現在状態の取得に失敗しました。[${err.toString()}]`);
            }
        }

        showCurrentStatus(cacheType) {
            var isCacheTypeOldEdition = this.permanentCacheStatusRepo.isCacheTypeOldEdition(cacheType);
            var isCacheTypeFull = this.permanentCacheStatusRepo.isCacheTypeFull(cacheType);

            var note = '無効(既定値)';
            if (isCacheTypeOldEdition) {
                note = '旧版地図のみ適用中';
            }else if (isCacheTypeFull) {
                note = 'すべての地図で適用中';
            }
            var statusEl = document.querySelector('.js-permanent-cache-status');
            statusEl.innerText = note;
        }

        settingBtnArea(cacheType) {
            if (this.hasIndexedDbApi === false) {
                this.hiddenBtnArea('oldedition');
                this.hiddenBtnArea('full');
                this.hiddenBtnArea('clear');
                this.showNoApiArea();
                this.gaChannel.publish('indexedDB_api_nothing');
                return;
            }

            var isCacheTypeOldEdition = this.permanentCacheStatusRepo.isCacheTypeOldEdition(cacheType);
            var isCacheTypeFull = this.permanentCacheStatusRepo.isCacheTypeFull(cacheType);

            if (isCacheTypeOldEdition === false) {
                if (isCacheTypeFull === false) {
                    this.showBtnArea('oldedition', '旧版地図でのみ有効にする');
                }else{
                    this.hiddenBtnArea('oldedition');
                }
            }else{
                this.hiddenBtnArea('oldedition');
            }

            if (isCacheTypeFull === false) {
                this.showBtnArea('full', 'すべての地図で有効にする');
            }else{
                this.hiddenBtnArea('full');
            }

            if (isCacheTypeOldEdition === false && isCacheTypeFull === false) {
                this.hiddenBtnArea('clear');
            }else{
                this.showBtnArea('clear', '無効に戻す');
            }
        }

        showBtnArea(cacheTypePrefix, btnCaption) {
            var areaEl = document.querySelector(`.js-permanent-cache-${cacheTypePrefix}-btn-area`);
            areaEl.style.display = 'block';

            var btnEl = document.querySelector(`.js-permanent-cache-${cacheTypePrefix}-btn`);
            btnEl.value = btnCaption;
        }

        hiddenBtnArea(cacheTypePrefix) {
            var areaEl = document.querySelector(`.js-permanent-cache-${cacheTypePrefix}-btn-area`);
            areaEl.style.display = 'none';

            var btnCaption = `(非表示)`;
            var btnEl = document.querySelector(`.js-permanent-cache-${cacheTypePrefix}-btn`);
            btnEl.value = btnCaption;
        }

        showNoApiArea() {
            var areaEl = document.querySelector(`.js-permanent-cache-noapi-area`);
            areaEl.style.display = 'block';
        }

        settingEventHandlerToBtn() {
            var btnOldEdtionEl = document.querySelector('.js-permanent-cache-oldedition-btn');
            var btnFullEl = document.querySelector('.js-permanent-cache-full-btn');
            var btnClearEl = document.querySelector('.js-permanent-cache-clear-btn');
            var btnEstimateEl = document.querySelector('.js-permanent-cache-estimate-btn');

            var self = this;

            btnOldEdtionEl.addEventListener('click', function() {
                btnOldEdtionEl.disabled = true;
                var shouldActiveCacheType = 1;
                self.confirmActive(btnOldEdtionEl, shouldActiveCacheType);
            }, false);

            btnFullEl.addEventListener('click', function() {
                btnFullEl.disabled = true;
                var shouldActiveCacheType = 2;
                self.confirmActive(btnFullEl, shouldActiveCacheType);
            }, false);

            btnClearEl.addEventListener('click', function() {
                btnClearEl.disabled = true;
                self.confirmClear(btnClearEl);
            }, false);

            btnEstimateEl.addEventListener('click', function() {
                self.showEstimateArea();
            }, false);
        }

        async confirmActive(btnEl, shouldActiveCacheType) {
            if (confirm('画像を多数キャッシュするため、ディスク容量を取ります。\n「機能の説明」をご確認のうえ、ご利用ください。\n本当に有効化しますか？')){
                try {
                    if (shouldActiveCacheType === 1) {
                        this.gaChannel.publish('cache_active_old_edition');
                        await this.permanentCacheStatusRepo.saveOldEditionActive();
                    }else{
                        this.gaChannel.publish('cache_active_all');
                        await this.permanentCacheStatusRepo.saveFullActive();
                    }
                    this.reload();
                } catch(err) {
                    var errorText = err.toString();
                    this.gaChannel.publishError('cache_active_error', errorText);
                    alert(`有効化に失敗しました。[${errorText}]`);
                }
            }else{
                btnEl.disabled = false;
            }
        }

        async confirmClear(btnEl) {
            if (confirm('本当にキャッシュをすべて削除して無効化しますか？')){
                try {
                    this.gaChannel.publish('cache_inactive');
                    await this.permanentCacheStatusRepo.dropDatabase();
                    this.reload();
                } catch(err) {
                    var errorText = err.toString();
                    this.gaChannel.publishError('cache_inactive_error', errorText);
                    alert(`[削除＆無効化]に失敗しました。[${errorText}]`);
                }
            }else{
                btnEl.disabled = false;
            }
        }

        reload() {
            var self = this;
            setTimeout(function() {
                self.window_location.reload();
            }, 1000);
        }

        async showEstimateArea() {
            try {
                if ('storage' in this.window_navigator) {
                    if ('estimate' in this.window_navigator.storage) {
                        var estimate = await this.window_navigator.storage.estimate();
                        this.showCurrentEstimate(estimate);
                    }
                }
            } catch(err) {
                var errorText = err.toString();
                this.gaChannel.publishError('cache_estimate_error', errorText);
                console.error(`使用量の取得に失敗しました。[${errorText}]`);
            }
        }

        showCurrentEstimate(estimate) {
            var gb = 1024 * 1024 * 1024;
            var usageStr = (estimate.usage / gb).toFixed(2);
            var quotaStr = (estimate.quota / gb).toFixed(2);

            var usageEl = document.querySelector('.js-permanent-cache-estimate-usage');
            usageEl.innerText = usageStr;
            var quotaEl = document.querySelector('.js-permanent-cache-estimate-quota');
            quotaEl.innerText = quotaStr;
        }

    };

}(this));
