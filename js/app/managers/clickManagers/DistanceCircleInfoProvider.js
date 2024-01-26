(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.DistanceCircleInfoProvider = class DistanceCircleInfoProvider {
        constructor(configCircle) {
            this.configCircle = configCircle;
        }

        getBaseList() {
            return this.configCircle.infoList.filter((info) => info.always === true);
        }

        getAddingListByGeZoom() {
            var allList = this.configCircle.infoList.filter((info) => info.always === false);
            var len = allList.length;
            var listByGeZoom = new Map();
            for (var i = 0; i < len; i++) {
                var info = allList[i];
                if (listByGeZoom.has(info.geZoom)) {
                    var list = listByGeZoom.get(info.geZoom)
                    list.push(info);
                }else{
                    listByGeZoom.set(info.geZoom, [info]);
                }
            }
            return listByGeZoom;
        }

    };

}(this));
