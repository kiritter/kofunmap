(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.DistanceCircleFactory = class DistanceCircleFactory {
        constructor(distanceCircleInfoProvider) {
            this.distanceCircleInfoProvider = distanceCircleInfoProvider;
        }

        createCurrentGroup(center) {
            var centerOptions = {
                radius: 1,
                weight: 3,
                color: '#00F',
                fillColor: '#00F',
            };

            var baseOptList = [];
            var baseList = this.distanceCircleInfoProvider.getBaseList();
            var baseLen = baseList.length;
            for (var i = 0; i < baseLen; i++) {
                var opt = DistanceCircleFactory._createCircleOptions(baseList[i]);
                baseOptList.push(opt);
            }

            var addingOptListByGeZoom = new Map();
            var addingListByGeZoom = this.distanceCircleInfoProvider.getAddingListByGeZoom();
            for (var [geZoom, infoList] of addingListByGeZoom) {
                var optList = [];
                for (var i = 0; i < infoList.length; i++) {
                    var opt = DistanceCircleFactory._createCircleOptions(infoList[i]);
                    optList.push(opt);
                }
                addingOptListByGeZoom.set(geZoom, optList);
            }

            var baseGroupAsArray = DistanceCircleFactory._createCurrentGroupCore(center, centerOptions, baseOptList);
            var addingGroupAsArrayByGeZoom = DistanceCircleFactory._createAddingGroup(center, addingOptListByGeZoom);

            return {
                baseGroupAsArray: baseGroupAsArray,
                addingGroupAsArrayByGeZoom: addingGroupAsArrayByGeZoom
            };
        }

        static _createCircleOptions(info) {
            var options = {
                radius: info.radiusKm * 1000,
                myLabelContent: info.caption,
                weight: 1,
                color: '#00F',
                fill: false,
            };
            if (info.color) {
                options.color = info.color;
            }
            return options;
        }

        static _createCurrentGroupCore(center, centerOptions, optionList) {
            var centerCircle = L.circle(center, centerOptions);
            var groupAsArray = [centerCircle];

            var len = optionList.length;
            for (var i = 0; i < len; i++) {
                var opt = optionList[i];
                var circle = L.circle(center, opt);
                var tooltip = DistanceCircleFactory._createLabel(center, opt.radius, opt.myLabelContent);
                groupAsArray.push(circle);
                groupAsArray.push(tooltip);
            }
            return groupAsArray;
        }

        static _createAddingGroup(center, optionListByGeZoom) {
            var groupAsArrayByGeZoom = new Map();
            for (var [geZoom, optionList] of optionListByGeZoom) {
                var groupAsArray = [];
                var len = optionList.length;
                for (var i = 0; i < len; i++) {
                    var opt = optionList[i];
                    var circle = L.circle(center, opt);
                    var tooltip = DistanceCircleFactory._createLabel(center, opt.radius, opt.myLabelContent);
                    groupAsArray.push(circle);
                    groupAsArray.push(tooltip);
                }
                groupAsArrayByGeZoom.set(geZoom, groupAsArray);
            }
            return groupAsArrayByGeZoom;
        }

        static _createLabel(center, radius, content) {
            var latlng = MyApp.UtilCircle.calcTargetLatLngBy(center, radius);
            var options = {
                content: content,
                permanent: true,
                direction: 'right',
            };
            var tooltip = L.tooltip(latlng, options);
            return tooltip;
        }

    };

}(this));
