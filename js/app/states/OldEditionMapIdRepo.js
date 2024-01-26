(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.OldEditionMapIdRepo = class OldEditionMapIdRepo {
        constructor(currentCacheType) {
            var isCacheTypeOldEdition = MyApp.PermanentCacheStatusRepo.isCacheTypeOldEdition(currentCacheType);
            var isCacheTypeFull = MyApp.PermanentCacheStatusRepo.isCacheTypeFull(currentCacheType);

            if (isCacheTypeOldEdition === false && isCacheTypeFull === false) {
                this.coreRepo = MyApp.oldEditionMapIdLocalRepo;
            }else{
                this.coreRepo = MyApp.oldEditionMapIdCacheRepo;
            }
        }

        exists(z, x, y) {
            return this.coreRepo.exists(z, x, y);
        }

        findBy(z, x, y) {
            return this.coreRepo.findBy(z, x, y);
        }

        save(z, x, y, mapIdCsv) {
            return this.coreRepo.save(z, x, y, mapIdCsv);
        }

    };

}(this));
