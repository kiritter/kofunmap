(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.OldEditionMapIdLocalRepo = class OldEditionMapIdLocalRepo {
        constructor() {
            this.mapIdCsvByZxy = new Map();
        }

        _myGetKey(z, x, y) {
            var key = `${z}/${x}/${y}`;
            return key;
        }

        exists(z, x, y) {
            var key = this._myGetKey(z, x, y);
            var has = this.mapIdCsvByZxy.has(key);
            return new Promise(function(resolve, reject) {
                resolve(has);
            });
        }

        findBy(z, x, y) {
            var key = this._myGetKey(z, x, y);
            var mapIdCsv = this.mapIdCsvByZxy.get(key);
            return new Promise(function(resolve, reject) {
                resolve(mapIdCsv);
            });
        }

        save(z, x, y, mapIdCsv) {
            var key = this._myGetKey(z, x, y);
            this.mapIdCsvByZxy.set(key, mapIdCsv);
            return new Promise(function(resolve, reject) {
                resolve(mapIdCsv);
            });
        }

    };

    MyApp.oldEditionMapIdLocalRepo = new MyApp.OldEditionMapIdLocalRepo();

}(this));
