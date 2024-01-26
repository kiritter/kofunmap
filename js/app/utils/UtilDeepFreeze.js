(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UtilDeepFreeze = class UtilDeepFreeze {
        constructor() {
        }

        static execute(object) {
            const propNames = Object.getOwnPropertyNames(object);

            for (const name of propNames) {
                const value = object[name];

                if (value && typeof value === "object") {
                    UtilDeepFreeze.execute(value);
                }
            }

            return Object.freeze(object);
        }
        
    };

}(this));
