L.LayerGroup.WithAdding = L.LayerGroup.extend({

    initialize: function(layers, options) {
        L.LayerGroup.prototype.initialize.call(this, layers, options);
    },

    _myWithAdding: function(currentZoom, addingLayersByGeZoom) {
        this._myAddingObjList = [];
        for (var [geZoom, addingLayers] of addingLayersByGeZoom) {
            var wrapAddingGroup = L.layerGroup(addingLayers);
            this._myAddingObjList.push({
                isAdded: false,
                geZoom: geZoom,
                wrapAddingGroup, wrapAddingGroup
            });
        }

        var len = this._myAddingObjList.length;
        for (var i = 0; i < len; i++) {
            var addingObj = this._myAddingObjList[i];
            if (currentZoom >= addingObj.geZoom) {
                addingObj.isAdded = true;
                this.addLayer(addingObj.wrapAddingGroup);
            }
        }
    },

    _mySwitchAdding: function(currentZoom) {
        if (!this._myAddingObjList) {
            return;
        }
        var len = this._myAddingObjList.length;
        for (var i = 0; i < len; i++) {
            var addingObj = this._myAddingObjList[i];
            if (currentZoom >= addingObj.geZoom) {
                if (addingObj.isAdded === false) {
                    addingObj.isAdded = true;
                    this.addLayer(addingObj.wrapAddingGroup);
                }
            }else{
                if (addingObj.isAdded) {
                    addingObj.isAdded = false;
                    this.removeLayer(addingObj.wrapAddingGroup);
                }
            }
        }
    },

});

L.layerGroup.withAdding = function(layers, options) {
    return new L.LayerGroup.WithAdding(layers, options);
};
