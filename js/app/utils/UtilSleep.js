(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UtilSleep = class UtilSleep {
        constructor() {
        }

        static sleep(msec) {
            return new Promise(function(resolve, reject) {
                var timerId = setTimeout(function() {
                    clearTimeout(timerId);
                    resolve();
                }, msec);
            });
        }
        
    };

}(this));
