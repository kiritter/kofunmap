(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UtilLeafletTooltip = class UtilLeafletTooltip {
        constructor() {
        }



        static calcTooltipOffsetForMarker(direction) {
            var defaultX = 16;
            var defaultY = -28;
            var customTopY = -15;
            if (direction === 'right') {
                return L.point(0, 0);
            }else if (direction === 'left') {
                return L.point((defaultX * -2), 0);
            }else if (direction === 'top') {
                return L.point((defaultX * -1), customTopY);
            }else if (direction === 'bottom') {
                return L.point((defaultX * -1), (defaultY * -1));
            }else if (direction === 'center') {
                return L.point((defaultX * -1), (defaultY * -0.5));
            }else{
                return L.point(0, 0);
            }
        }

        static calcTooltipOffsetForCircleMarker(direction) {
            var customAbsX = 8;
            var customAbsY = 8;
            var lrOffsetY = 0;
            var btOffsetY = 0;
            return UtilLeafletTooltip._calcTooltipOffsetCore(direction, customAbsX, customAbsY, lrOffsetY, btOffsetY);
        }

        static calcTooltipOffsetForNoIcon(direction) {
            var customAbsX = 8;
            var customAbsY = 8;
            var lrOffsetY = 0;
            var btOffsetY = 0;
            return UtilLeafletTooltip._calcTooltipOffsetCore(direction, customAbsX, customAbsY, lrOffsetY, btOffsetY);
        }

        static calcTooltipOffsetForEventIcon(direction) {
            var customAbsX = 10;
            var customAbsY = 20;
            var lrOffsetY = -15;
            var btOffsetY = -16;
            return UtilLeafletTooltip._calcTooltipOffsetCore(direction, customAbsX, customAbsY, lrOffsetY, btOffsetY);
        }

        static _calcTooltipOffsetCore(direction, customAbsX, customAbsY, lrOffsetY, btOffsetY) {
            var customLeftX = customAbsX * -1;
            var customRightX = customAbsX;
            var customTopY = customAbsY * -1;
            var customBottomY = customAbsY;
            if (direction === 'right') {
                return L.point(customRightX, lrOffsetY);
            }else if (direction === 'left') {
                return L.point(customLeftX, lrOffsetY);
            }else if (direction === 'top') {
                return L.point(0, customTopY);
            }else if (direction === 'bottom') {
                return L.point(0, customBottomY + btOffsetY);
            }else if (direction === 'center') {
                return L.point(0, 0);
            }else{
                return L.point(0, 0);
            }
        }

    };

}(this));
