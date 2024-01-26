(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UtilMobileDetector = class UtilMobileDetector {
        constructor() {
        }

        static init(matchMedia) {
            if (matchMedia) {
                var mql = matchMedia('(min-width: 975px)');
                if (mql.matches) {
                }else{
                    var messageText = '<表示幅が狭い場合向けメッセージです>\n　(自動で消えます)\n\n表示内容と画面サイズの都合から\n基本的にはPCで使うことを想定したWebサイトとなっております。\n\n(一部のAndroidスマホ/小型タブレットでは、縦向きで、PC版サイトを表示するモードを使うことで、かろうじて操作/閲覧可能です)';
                    var options = {
                        msec: 4000,
                        topPixel: 60,
                    };
                    MyApp.UtilMessage.show(messageText, options);
                }
            }else{
                console.warn('window.matchMedia is not found.');
            }
        }

    };

}(this));
