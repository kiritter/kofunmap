(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.PermanentCacheStatusRepo = class PermanentCacheStatusRepo {
        static CONST = {
            CACHE_TYPE_KEY: 'cache_type',
            CACHE_TYPE_VAL: {
                FULL: 1,
                OLD_EDITION: 2,
            },
        }

        constructor(globalState) {
            this.hasIndexedDbApi = globalState.hasIndexedDbApi;
            this.localforage = global.localforage;
            this.DB_NAME = 'Db_Kofun';
            if (this.hasIndexedDbApi) {
                this.store = this._createInstanceCore(this.localforage, this.DB_NAME);
            }
        }

        _createInstanceCore(localforage, DB_NAME) {
            var config = {
                driver      : localforage.INDEXEDDB,
                name        : DB_NAME,
                version     : 1.0,
                storeName   : `PermanentCacheStatus`,
                description : 'Cache Status'
            };
            return localforage.createInstance(config);
        }



        async findCacheType() {
            var key = PermanentCacheStatusRepo.CONST.CACHE_TYPE_KEY;
            var value = await this.findBy(key);
            return value;
        }

        async findBy(key) {
            if (this.hasIndexedDbApi === false) {
                return new Promise(function(resolve, reject) {
                    resolve(null);
                });
            }

            try {
                var value = await this.store.getItem(key);
                return value;
            } catch(err) {
                console.error('PermanentCacheStatusRepo[findBy()]', err);
                throw new Error(err.message);
            }
        }

        isCacheTypeOldEdition(cacheType) {
            return PermanentCacheStatusRepo.isCacheTypeOldEdition(cacheType);
        }
        static isCacheTypeOldEdition(cacheType) {
            if (cacheType === PermanentCacheStatusRepo.CONST.CACHE_TYPE_VAL.OLD_EDITION) {
                return true;
            }else{
                return false;
            }
        }

        isCacheTypeFull(cacheType) {
            return PermanentCacheStatusRepo.isCacheTypeFull(cacheType);
        }
        static isCacheTypeFull(cacheType) {
            if (cacheType === PermanentCacheStatusRepo.CONST.CACHE_TYPE_VAL.FULL) {
                return true;
            }else{
                return false;
            }
        }

        async saveOldEditionActive() {
            var key = PermanentCacheStatusRepo.CONST.CACHE_TYPE_KEY;
            var value = PermanentCacheStatusRepo.CONST.CACHE_TYPE_VAL.OLD_EDITION;
            await this.save(key, value);
        }

        async saveFullActive() {
            var key = PermanentCacheStatusRepo.CONST.CACHE_TYPE_KEY;
            var value = PermanentCacheStatusRepo.CONST.CACHE_TYPE_VAL.FULL;
            await this.save(key, value);
        }

        async save(key, value) {
            if (this.hasIndexedDbApi === false) {
                var message = 'hasIndexedDbApi[false] However, PermanentCacheStatusRepo[save()]';
                console.error(message);
                throw new Error(message);
            }

            try {
                await this.store.setItem(key, value);
            } catch(err) {
                console.error('PermanentCacheStatusRepo[save()]', err);
                throw new Error(err.message);
            }
        }

        async dropDatabase() {
            if (this.hasIndexedDbApi === false) {
                var message = 'hasIndexedDbApi[false] However, PermanentCacheStatusRepo[dropDatabase()]';
                console.error(message);
                throw new Error(message);
            }

            try {
                await this.localforage.dropInstance({
                    name: this.DB_NAME,
                });
            } catch(err) {
                console.error('PermanentCacheStatusRepo[dropDatabase()]', err);
                throw new Error(err.message);
            }
        }

    };

}(this));
