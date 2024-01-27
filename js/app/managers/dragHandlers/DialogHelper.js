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
            var limitLeft = ((bodyWidth - bufferRight) < 0) ? (bodyWidth * 0.2) : (bodyWidth - bufferRight);
            if ((bufferLeft <= newLeft) && (newLeft <= limitLeft)) {
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
