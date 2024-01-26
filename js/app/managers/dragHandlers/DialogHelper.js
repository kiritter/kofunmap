(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.DialogHelper = class DialogHelper {
        constructor() {
        }


        static mousemoveCallback(event, coreObj, dragHandleEl, movingTargetEl, bufferRight) {

            var bodyWidth = document.body.clientWidth;
            var bodyHeight = document.body.clientHeight;
            var currentLeft = movingTargetEl.getBoundingClientRect().left;
            var currentTop = movingTargetEl.getBoundingClientRect().top;

            var diffX = event.pageX - coreObj.prevPageX;
            var diffY = event.pageY - coreObj.prevPageY;

            var newLeft = currentLeft + diffX;
            var newTop = currentTop + diffY;

            var bufferLeft = 10;
            if ((bufferLeft <= newLeft) && (newLeft <= bodyWidth - bufferRight)) {
                coreObj.prevPageX = event.pageX;
                movingTargetEl.style.left = (currentLeft + diffX) + 'px';
            }
            var bufferTop = 80;
            var bufferBottom = 100;
            if ((bufferTop <= newTop) && (newTop <= bodyHeight - bufferBottom)) {
                coreObj.prevPageY = event.pageY;
                movingTargetEl.style.top = (currentTop + diffY) + 'px';
            }
        }

    };

}(this));
