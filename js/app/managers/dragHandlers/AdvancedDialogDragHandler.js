(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.AdvancedDialogDragHandler = class AdvancedDialogDragHandler {
        constructor(global) {
            this.dragHandlerCore = new MyApp.DragHandlerCore(global);
        }

        init() {
            var dragHandleSelector = '.js-permanent-cache-header';
            var movingTargetSelector = '.js-permanent-cache-area';

            this.dragHandlerCore.init(
                dragHandleSelector,
                movingTargetSelector,
                AdvancedDialogDragHandler._mousedownBeforeCallback,
                AdvancedDialogDragHandler._mouseupBeforeCallback,
                AdvancedDialogDragHandler._mousemoveCallback
            );
        }

        static _mousedownBeforeCallback(event, bodyEl, dragHandleEl) {
            bodyEl.classList.add('cursor-dragging-whole');
        }

        static _mouseupBeforeCallback(event, bodyEl, dragHandleEl) {
            bodyEl.classList.remove('cursor-dragging-whole');
        }

        static _mousemoveCallback(event, coreObj, dragHandleEl, movingTargetEl) {
            var bufferRight = 412;
            MyApp.DialogHelper.mousemoveCallback(event, coreObj, dragHandleEl, movingTargetEl, bufferRight);
        }

    };

}(this));
