(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.RecommendDialogDragHandler = class RecommendDialogDragHandler {
        constructor(global) {
            this.dragHandlerCore = new MyApp.DragHandlerCore(global);
        }

        init() {
            var dragHandleSelector = '.js-recommend-place-header';
            var movingTargetSelector = '.js-recommend-place-area';

            this.dragHandlerCore.init(
                dragHandleSelector,
                movingTargetSelector,
                RecommendDialogDragHandler._mousedownBeforeCallback,
                RecommendDialogDragHandler._mouseupBeforeCallback,
                RecommendDialogDragHandler._mousemoveCallback
            );
        }

        static _mousedownBeforeCallback(event, bodyEl, dragHandleEl) {
            bodyEl.classList.add('cursor-dragging-whole');
        }

        static _mouseupBeforeCallback(event, bodyEl, dragHandleEl) {
            bodyEl.classList.remove('cursor-dragging-whole');
        }

        static _mousemoveCallback(event, coreObj, dragHandleEl, movingTargetEl) {
            var bufferRight = 349;
            MyApp.DialogHelper.mousemoveCallback(event, coreObj, dragHandleEl, movingTargetEl, bufferRight);
        }

    };

}(this));
