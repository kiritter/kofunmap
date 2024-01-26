(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.DragHandlerCore = class DragHandlerCore {
        constructor(global) {
            this.isDragging = false;
            this.prevPageX = 0;
            this.prevPageY = 0;
            this.preventSelectTargetList = [
                '.js-map-left-wrap',
                '.js-latlng-info-area',
            ];
            this.isPc = (typeof global.ontouchstart === 'undefined');
        }

        init(
            dragHandleSelector, movingTargetSelector,
            mousedownBeforeCallback, mouseupBeforeCallback, mousemoveCallback
        ) {
            this._settingHandle(dragHandleSelector, mousedownBeforeCallback);
            this._settingBody(dragHandleSelector, movingTargetSelector, mouseupBeforeCallback, mousemoveCallback)
        }

        _settingHandle(dragHandleSelector, mousedownBeforeCallback) {
            var bodyEl = document.querySelector('.js-body');
            var dragHandleEl = document.querySelector(dragHandleSelector);

            var self = this;
            if (this.isPc) {
                dragHandleEl.addEventListener('mousedown', function(mouseEvent) {
                    var event = {pageX: mouseEvent.pageX, pageY: mouseEvent.pageY};
                    mousedownBeforeCallback(event, bodyEl, dragHandleEl);
                    self._addPreventSelectToOthers();
                    self.prevPageX = mouseEvent.pageX;
                    self.prevPageY = mouseEvent.pageY;
                    self.isDragging = true;
                }, false);
            }else{
                dragHandleEl.addEventListener('touchstart', function(touchEvent) {
                    var event = {pageX: touchEvent.touches[0].pageX, pageY: touchEvent.touches[0].pageY};
                    mousedownBeforeCallback(event, bodyEl, dragHandleEl);
                    self._addPreventSelectToOthers();
                    self.prevPageX = touchEvent.touches[0].pageX;
                    self.prevPageY = touchEvent.touches[0].pageY;
                    self.isDragging = true;
                }, false);
            }
        }

        _settingBody(dragHandleSelector, movingTargetSelector, mouseupBeforeCallback, mousemoveCallback) {
            var bodyEl = document.querySelector('.js-body');
            var dragHandleEl = document.querySelector(dragHandleSelector);
            var movingTargetEl = document.querySelector(movingTargetSelector);


            var self = this;
            if (this.isPc) {
                document.addEventListener('mouseup', function(mouseEvent) {
                    var event = {pageX: mouseEvent.pageX, pageY: mouseEvent.pageY};
                    mouseupBeforeCallback(event, bodyEl, dragHandleEl);
                    self._removePreventSelectToOthers();
                    self.prevPageX = 0;
                    self.prevPageY = 0;
                    self.isDragging = false;
                }, false);
            }else{
                document.addEventListener('touchend', function(touchEvent) {
                    var event = {pageX: touchEvent.changedTouches[0].pageX, pageY: touchEvent.changedTouches[0].pageY};
                    mouseupBeforeCallback(event, bodyEl, dragHandleEl);
                    self._removePreventSelectToOthers();
                    self.prevPageX = 0;
                    self.prevPageY = 0;
                    self.isDragging = false;
                }, false);
            }

            if (this.isPc) {
                document.addEventListener('mousemove', function(mouseEvent) {
                    if (self.isDragging) {
                        var event = {pageX: mouseEvent.pageX, pageY: mouseEvent.pageY};
                        mousemoveCallback(event, self, dragHandleEl, movingTargetEl);
                    }
                }, false);
            }else{
                document.addEventListener('touchmove', function(touchEvent) {
                    if (self.isDragging) {
                        var event = {pageX: touchEvent.changedTouches[0].pageX, pageY: touchEvent.changedTouches[0].pageY};
                        mousemoveCallback(event, self, dragHandleEl, movingTargetEl);
                    }
                }, false);
            }
        }

        _addPreventSelectToOthers() {
            var self = this;
            this.preventSelectTargetList.forEach(function(target) {
                self._addPreventSelect(target);
            });
        }
        _addPreventSelect(targetClassName) {
            var el = document.querySelector(targetClassName);
            el.classList.add('prevent-select');
        }

        _removePreventSelectToOthers() {
            var self = this;
            this.preventSelectTargetList.forEach(function(target) {
                self._removePreventSelect(target);
            });
        }
        _removePreventSelect(targetClassName) {
            var el = document.querySelector(targetClassName);
            el.classList.remove('prevent-select');
        }
    };

}(this));
