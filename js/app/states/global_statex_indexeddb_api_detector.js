(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};


    if (global.indexedDB) {
        MyApp.globalState.hasIndexedDbApi = true;
    }

}(this));
