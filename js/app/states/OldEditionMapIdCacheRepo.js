(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.OldEditionMapIdCacheRepo = class OldEditionMapIdCacheRepo {
        constructor() {
            var localforage = global.localforage;
            this.store = this._createInstanceCore(localforage);
        }

        _createInstanceCore(localforage) {
            var config = {
                driver      : localforage.INDEXEDDB,
                name        : 'Db_Kofun',
                version     : 1.0,
                storeName   : `OldEditionMapId`,
                description : 'Map Id Store'
            };
            return localforage.createInstance(config);
        }

        _myGetKey(z, x, y) {
            var key = `${z}/${x}/${y}`;
            return key;
        }

        exists(z, x, y) {
            var key = this._myGetKey(z, x, y);
            var self = this;
            return new Promise(function(resolve, reject) {
                self.store.getItem(key)
                    .then(function(value) {
                        if (value) {
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    })
                    .catch(function(err) {
                        console.error('OldEditionMapIdCacheRepo[exists()]', err);
                        reject(err);
                    });
            });
        }

        findBy(z, x, y) {
            var key = this._myGetKey(z, x, y);
            var self = this;
            return new Promise(function(resolve, reject) {
                self.store.getItem(key)
                    .then(function(value) {
                        resolve(value);
                    })
                    .catch(function(err) {
                        console.error('OldEditionMapIdCacheRepo[findBy()]', err);
                        reject(err);
                    });
            });
        }

        save(z, x, y, mapIdCsv) {
            var key = this._myGetKey(z, x, y);
            var value = mapIdCsv;
            var self = this;
            return new Promise(function(resolve, reject) {
                self.store.setItem(key, value)
                    .then(function(value) {
                        resolve(value);
                    })
                    .catch(function(err) {
                        console.error('OldEditionMapIdCacheRepo[save()]', err);
                        reject(err);
                    });
            });
        }

    };

    if (MyApp.globalState.hasIndexedDbApi) {
        MyApp.oldEditionMapIdCacheRepo = new MyApp.OldEditionMapIdCacheRepo();
    }

}(this));
