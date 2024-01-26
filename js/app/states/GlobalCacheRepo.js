(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.GlobalCacheRepo = class GlobalCacheRepo {

        constructor() {
            this.localforage = global.localforage;
            this.DB_NAME = 'Db_Kofun';

            this.SHARDING_NUM = 100;
            this.storeMap = this._createInstanceMap(this.localforage, this.DB_NAME, this.SHARDING_NUM);
            this.regex = /^.+\-[0-9]+\/([0-9]+)\/[0-9]+$/;
        }

        _createInstanceMap(localforage, DB_NAME, SHARDING_NUM) {
            var storeMap = new Map();
            for (var i = 0; i < SHARDING_NUM; i++) {
                var instance = this._createInstanceCore(localforage, DB_NAME, i);
                var key = `${i}`;
                storeMap.set(key, instance);
            }
            return storeMap;
        }

        _createInstanceCore(localforage, DB_NAME, num) {
            var config = {
                driver      : localforage.INDEXEDDB,
                name        : DB_NAME,
                version     : 1.0,
                storeName   : `TileBitmap_${num}`,
                description : 'Tile Image Cache'
            };
            return localforage.createInstance(config);
        }

        _retrieveInstance(key) {
            var targetNum;
            var result = key.match(this.regex);
            if (result === null) {
                targetNum = 0;
            }else{
                var xStr = result[1];
                var x = parseInt(xStr, 10);
                targetNum = x % this.SHARDING_NUM;
            }
            var targetKey = `${targetNum}`;
            var store = this.storeMap.get(targetKey);
            return store;
        }
        _retrieveInstanceAll() {
            var storeList = Array.from(this.storeMap.values());
            return storeList;
        }

        exists(key) {
            var self = this;
            return new Promise(function(resolve, reject) {
                var store = self._retrieveInstance(key);
                store.getItem(key)
                    .then(function(value) {
                        if (value) {
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    })
                    .catch(function(err) {
                        console.error('GlobalCacheRepo[exists()]', err);
                        reject(err);
                    });
            });
        }

        findBy(key) {
            var self = this;
            return new Promise(function(resolve, reject) {
                var store = self._retrieveInstance(key);
                store.getItem(key)
                    .then(function(value) {
                        resolve(value);
                    })
                    .catch(function(err) {
                        console.error('GlobalCacheRepo[findBy()]', err);
                        reject(err);
                    });
            });
        }

        save(key, value) {
            var self = this;
            return new Promise(function(resolve, reject) {
                var store = self._retrieveInstance(key);
                store.setItem(key, value)
                    .then(function(value) {
                        resolve(value);
                    })
                    .catch(function(err) {
                        console.error('GlobalCacheRepo[save()]', err);
                        reject(err);
                    });
            });
        }

    };

    if (MyApp.globalState.hasIndexedDbApi) {
        MyApp.globalCacheRepo = new MyApp.GlobalCacheRepo();
    }

}(this));
