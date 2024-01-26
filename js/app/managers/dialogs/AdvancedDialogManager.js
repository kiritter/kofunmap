(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.AdvancedDialogManager = class AdvancedDialogManager {
        constructor(gaChannel, permanentCacheManager) {
            this.gaChannel = gaChannel;
            this.permanentCacheManager = permanentCacheManager;
            this.isFirstShow = false;
            this.initWidth = 0;
            this.initHeight = 0;
        }

        async init() {
            this.settingPopupShowBtn();
            this.settingPopupCloseBtn();
        }

        settingPopupShowBtn() {
            var self = this;
            var btnEl = document.querySelector('.js-advanced-show-btn');
            btnEl.addEventListener('click', function() {
                var areaEl = document.querySelector('.js-permanent-cache-area');
                areaEl.style.display = 'block';
                if (self.isFirstShow === false) {
                    self.isFirstShow = true;
                    self._backupDialogSize(areaEl);
                }else{
                    self._restoreDialogSize(areaEl);
                }
                self.permanentCacheManager.showEstimateArea();
                self.gaChannel.publish('advanced');
            }, false);
        }
        settingPopupCloseBtn() {
            var btnElList = document.querySelectorAll('.js-permanent-cache-close-btn');
            btnElList.forEach(function(btnEl) {
                btnEl.addEventListener('click', function() {
                    var areaEl = document.querySelector('.js-permanent-cache-area');
                    areaEl.style.display = 'none';
                }, false);
            });
        }

        _backupDialogSize(areaEl) {
            var width = areaEl.getBoundingClientRect().width;
            var height = areaEl.getBoundingClientRect().height;
            this.initWidth = width;
            this.initHeight = height;
        }
        _restoreDialogSize(areaEl) {
            areaEl.style.width = this.initWidth + 'px';
            areaEl.style.height = this.initHeight + 'px';
        }

        static settingPopupBodyHtml() {
            var bodyHtml = AdvancedDialogManager._createBodyHtml();
            var bodyEl = document.querySelector('.js-permanent-cache-body');
            bodyEl.innerHTML = bodyHtml;
        }

        static _createBodyHtml() {
            var html = `
<div class="permanent-cache-title">永続的キャッシュ機能</div>
<div class="permanent-cache-note">すぐに数百MB～数GBを費やす機能であるため、<br>「<span class="permanent-cache-note-link"><a href="html/readme_cache.html" target="_blank">機能の説明</a></span>」をご確認のうえ、ご利用ください。</div>
<div class="permanent-cache-status-display">現在の設定値は <span class="permanent-cache-status-text">[<span class="js-permanent-cache-status">xxx</span>]</span> です。</div>
<div class="permanent-cache-each-wrap">
    <div class="permanent-cache-noapi-area js-permanent-cache-noapi-area">
        <div class="permanent-cache-btn-note-noapi">（※保存用APIが存在しない環境のため、キャッシュ機能利用不可）</div>
    </div>
    <div class="js-permanent-cache-oldedition-btn-area">
        <input type="button" class="permanent-cache-btn js-permanent-cache-oldedition-btn" value="xxx">
        <div class="permanent-cache-btn-note">（切替後、画面を自動で再表示します）</div>
    </div>
    <div class="js-permanent-cache-full-btn-area">
        <input type="button" class="permanent-cache-btn js-permanent-cache-full-btn" value="xxx">
        <div class="permanent-cache-btn-note">（切替後、画面を自動で再表示します）</div>
    </div>
    <div class="js-permanent-cache-clear-btn-area">
        <input type="button" class="permanent-cache-btn js-permanent-cache-clear-btn" value="xxx">
        <div class="permanent-cache-btn-note">（無効化と同時にキャッシュもすべて削除します）</div>
    </div>
</div>
<div class="permanent-cache-estimate-display">
    <div>目安として（※容量確認APIが利用可能な場合に数値を表示）</div>
    <div class="permanent-cache-estimate-content">
        <div>現Origin(<span class="js-permanent-cache-origin"></span>)配下の総合計量</div>
        <div>・使用量：[<span class="js-permanent-cache-estimate-usage">-</span>]GB</div>
        <div>・制限値：[<span class="js-permanent-cache-estimate-quota">-</span>]GB</div>
        <div class="permanent-cache-estimate-content-note">※上記は本Dialog表示時点での値です。<br>　本Dialogを開いたままの状態では自動で値は変わりません。</div>
        <div><input type="button" class="permanent-cache-estimate-btn js-permanent-cache-estimate-btn" value="使用量 再取得"></div>
    </div>
</div>
`;
            return html;
        }

    };

}(this));
