(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UtilNumber = class UtilNumber {
        constructor() {
        }

        static isValidZoomNumber(text) {
            var regex = /^([5-9]|1[0-8]?)$/;
            if (regex.test(text)) {
                return true;
            }
            return false;
        }

        static isNaturalNumber(text) {
            var regex = /^(0|[1-9][0-9]*)$/;
            if (regex.test(text)) {
                return true;
            }
            return false;
        }

        static isDecimalNumber(text) {
            var regex = /^(-?0|-?[1-9][0-9]*)(\.[0-9]+)?$/;
            if (regex.test(text)) {
                return true;
            }
            return false;
        }

    };

}(this));
