
L.Control.Layers.WithClose = L.Control.Layers.extend({
    onAdd: function(map) {
        var container = L.Control.Layers.prototype.onAdd.call(this, map);
        var targetEl = container.querySelector('.leaflet-control-layers-list');
        const separator = document.createElement('div');
        separator.classList.add('leaflet-control-layers-separator');
        targetEl.insertAdjacentElement('beforeend', separator);
        var customButtonWraper = L.DomUtil.create('div', 'control-layers-custom-button-collapse-wraper', targetEl);
        this._customButton = L.DomUtil.create('button', 'control-layers-custom-button-collapse', customButtonWraper);
        this._customButton.innerText = '閉じる';
        var self = this;
        L.DomEvent.on(this._customButton, 'click', function(e){
            L.Control.Layers.prototype.collapse.call(self, map);
        }, this);
        return container;
    },

    onRemove: function(map) {
        L.DomEvent.off(this._customButton);
        L.DomUtil.remove(this._customButton);
        L.Control.Layers.prototype.onRemove.call(this, map);
    },

    _checkDisabledLayers() {
    },

    _addItem(obj) {
        var label = L.Control.Layers.prototype._addItem.call(this, obj);

        var checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.setAttribute('data-layer-name', obj.layer.options.myLayerName);

            if (obj.layer.options.addSeparatorToBeforebegin) {
                const separator = document.createElement('div');
                separator.classList.add('leaflet-control-layers-separator');
                label.insertAdjacentElement('beforebegin', separator);
            }

            if (obj.layer.options.isSingleChoiceLayer) {
                label.classList.add('single-choice-layer');
            }
            if (obj.layer.options.overlayMenuCssClassName) {
                label.classList.add(obj.layer.options.overlayMenuCssClassName);
            }

            if (obj.layer.options.blockDescription) {
                const desc = document.createElement('div');
                desc.innerText = obj.layer.options.blockDescription;
                desc.classList.add(obj.layer.options.blockDescriptionCssClassName);
                label.insertAdjacentElement('beforebegin', desc);
            }
            if (obj.layer.options.afterNote) {
                const note = document.createElement('div');
                note.innerText = obj.layer.options.afterNote;
                note.classList.add(obj.layer.options.afterNoteCssClassName);
                label.insertAdjacentElement('afterend', note);
            }

            if (obj.layer.options.sourceUrl) {
                const wrap = document.createElement('span');
                wrap.classList.add(obj.layer.options.sourceCssClassName);
                const link = document.createElement('a');
                link.href = obj.layer.options.sourceUrl;
                link.innerText = obj.layer.options.sourceText;
                link.target = '_blank';
                wrap.appendChild(link);
                const span = document.createElement('span');
                span.innerText = obj.layer.options.sourceNote;
                wrap.appendChild(span);
                checkbox.parentElement.appendChild(wrap);
            }

            if (obj.layer.options.isLastElement) {
                const separator1 = document.createElement('div');
                separator1.classList.add('leaflet-control-layers-separator');
                label.insertAdjacentElement('afterend', separator1);

                var _createMyWrap = function(linkInfo) {
                    const wrap = document.createElement('div');
                    wrap.classList.add(linkInfo.sourceSummaryCssClassName);
                    const link = document.createElement('a');
                    link.href = linkInfo.sourceSummaryUrl;
                    link.innerText = linkInfo.sourceSummaryText;
                    link.target = '_blank';
                    wrap.appendChild(link);
                    const span = document.createElement('span');
                    span.innerText = linkInfo.sourceSummaryNote;
                    wrap.appendChild(span);
                    return wrap;
                };
                var linkInfoList = obj.layer.options.lastElementLinkInfoList;
                var len = linkInfoList.length;
                var insertTargetEl = separator1;
                for (var i = 0; i < len; i++) {
                    const wrap = _createMyWrap(linkInfoList[i]);
                    insertTargetEl.insertAdjacentElement('afterend', wrap);
                    insertTargetEl = wrap;
                }
            }
        }

        return label;
    },

    expand: function () {
        L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
        this._section.style.height = null;
        var myZoomButtonLabelHeight = 50;
        var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50 + myZoomButtonLabelHeight);
        if (acceptableHeight < this._section.clientHeight) {
            L.DomUtil.addClass(this._section, 'leaflet-control-layers-scrollbar');
            this._section.style.height = acceptableHeight + 'px';
        } else {
            L.DomUtil.removeClass(this._section, 'leaflet-control-layers-scrollbar');
        }
        this._checkDisabledLayers();
        return this;
    },
});

L.control.layers.withClose = function(baselayers, overlays, options) {
    return new L.Control.Layers.WithClose(baselayers, overlays, options);
};
