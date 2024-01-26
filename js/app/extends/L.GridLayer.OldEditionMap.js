L.GridLayer.OldEditionMap = L.GridLayer.extend({

    initialize(options) {
        L.GridLayer.prototype.initialize.call(this, options);
        this._myOldEditionMapIdLocalRepo = options.myOldEditionMapIdLocalRepo;
    },

    createTile: function(coords) {
        var tileCanvas = this._myCreateTileCanvas();

        this._myDrawToCanvas(tileCanvas, coords, this.options.myTileUrl);

        return tileCanvas;
    },

    _myCreateTileCanvas: function() {
        var tileCanvas = L.DomUtil.create('canvas', 'leaflet-tile');

        var size = this.getTileSize();
        tileCanvas.width = size.x;
        tileCanvas.height = size.y;

        return tileCanvas;
    },

    _myGetAreaInfoList: function() {
        return MyApp.configOldEditionMap.AreaList;
    },

    _myDrawToCanvas: function(tileCanvas, coords, myTileUrl) {
        var tileBounds = this._tileCoordsToBounds(coords);

        var overlapAreaList = [];
        var areaInfoList = this._myGetAreaInfoList();
        var len = areaInfoList.length;
        for (var i = 0; i < len; i++) {
            var areaInfo = areaInfoList[i];
            var northWest = L.latLng(areaInfo.nw[1], areaInfo.nw[0]);
            var sounthEast = L.latLng(areaInfo.se[1], areaInfo.se[0]);
            var targetAreaBounds = L.latLngBounds(northWest, sounthEast);

            var overlap = this._myOverlaps(tileBounds, targetAreaBounds);
            if (overlap) {
                overlapAreaList.push({areaInfoId: areaInfo.id, targetAreaBounds: targetAreaBounds});
            }
        }

        var overlapLen = overlapAreaList.length;

        var mapIdCsv = this._buildMapIdCsv(overlapAreaList);
        this._myOldEditionMapIdLocalRepo.save(coords.z, coords.x, coords.y, mapIdCsv);

        var totalImgCount = overlapLen;
        var drawnImgCount = 0;
        var self = this;
        var fireEventCallback = function() {
            drawnImgCount++;
            if (drawnImgCount === totalImgCount) {
                var propagate = false;
                self.fire('tile-image-loaded', {
                    coords: coords,
                    tileCanvas: tileCanvas,
                    mapIdCsv: mapIdCsv,
                }, propagate);
            }
        };

        for (var i = 0; i < overlapLen; i++) {
            var areaInfo = overlapAreaList[i];

            var overlapAreaBounds = this._myGetOverlapBounds(tileBounds, areaInfo.targetAreaBounds);
            var pixelInfo = this._myCalcPixelInfo(tileBounds, overlapAreaBounds);
            this._myDrawTargetArea(tileCanvas, areaInfo.areaInfoId, coords, myTileUrl, pixelInfo, fireEventCallback);
        }
    },

    _buildMapIdCsv(overlapAreaList) {
        var mapIdList = [];
        var overlapLen = overlapAreaList.length;
        for (var i = 0; i < overlapLen; i++) {
            var areaInfo = overlapAreaList[i];
            var mapId = areaInfo.areaInfoId;
            mapIdList.push(mapId);
        }
        return mapIdList.join(',');
    },

    _myOverlaps: function(tileBounds, targetAreaBounds) {
        var overlap = tileBounds.overlaps(targetAreaBounds);
        return overlap;
    },

    _myGetOverlapBounds(tileBounds, targetAreaBounds) {

        var p1 = tileBounds.getSouthWest();
        var x1 = p1.lng, y1 = p1.lat;
        var p2 = tileBounds.getNorthEast();
        var x2 = p2.lng, y2 = p2.lat;
        var p3 = targetAreaBounds.getSouthWest();
        var x3 = p3.lng, y3 = p3.lat;
        var p4 = targetAreaBounds.getNorthEast();
        var x4 = p4.lng, y4 = p4.lat;

        var xx1 = Math.max(x1, x3);
        var yy1 = Math.min(y2, y4);
        var pp1 = L.latLng(yy1, xx1);
        var xx4 = Math.min(x2, x4);
        var yy4 = Math.max(y1, y3);
        var pp4 = L.latLng(yy4, xx4);

        var overlapArea = L.latLngBounds(pp1, pp4);
        return overlapArea;
    },

    _myCalcPixelInfo: function(tileBounds, overlapAreaBounds) {
        const TILE_PIXEL = 256;
        var nwX_neX = this._myCalc_NwX_NeX(TILE_PIXEL, tileBounds, overlapAreaBounds);
        var nwY_swY = this._myCalc_NwY_SwY(TILE_PIXEL, tileBounds, overlapAreaBounds);
        return {
            sx: nwX_neX.nwX,
            sy:nwY_swY.nwY,
            sWidth: (nwX_neX.neX - nwX_neX.nwX),
            sHeight: (nwY_swY.swY - nwY_swY.nwY),
        };
    },
    _myCalc_NwX_NeX: function(TILE_PIXEL, tileBounds, overlapAreaBounds) {
        var originPoint = tileBounds.getNorthWest();
        var ne = tileBounds.getNorthEast();
        var tileLen = ne.lng - originPoint.lng;

        var overNw = overlapAreaBounds.getNorthWest();
        var targetLenNwX = overNw.lng - originPoint.lng;
        var overNwXAsPixel = (targetLenNwX * TILE_PIXEL) / tileLen;

        var overNe = overlapAreaBounds.getNorthEast();
        var targetLenNeX = overNe.lng - originPoint.lng;
        var overNeXAsPixel = (targetLenNeX * TILE_PIXEL) / tileLen;

        return {nwX: overNwXAsPixel, neX: overNeXAsPixel};
    },
    _myCalc_NwY_SwY: function(TILE_PIXEL, tileBounds, overlapAreaBounds) {
        var originPoint = tileBounds.getNorthWest();
        var sw = tileBounds.getSouthWest();
        var tileLen = sw.lat - originPoint.lat;

        var overNw = overlapAreaBounds.getNorthWest();
        var targetLenNwY = overNw.lat - originPoint.lat;
        var overNwYAsPixel = (targetLenNwY * TILE_PIXEL) / tileLen;

        var overSw = overlapAreaBounds.getSouthWest();
        var targetLenSwY = overSw.lat - originPoint.lat;
        var overSwYAsPixel = (targetLenSwY * TILE_PIXEL) / tileLen;

        return {nwY: overNwYAsPixel, swY: overSwYAsPixel};
    },

    _myDrawTargetArea: function(tileCanvas, targetAreaId, coords, myTileUrl, pixelInfo, fireEventCallback) {
        var self = this;
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.addEventListener('load', function imgLoadHandler() {
            img.removeEventListener('load', imgLoadHandler);

            var ctx = tileCanvas.getContext('2d');
            ctx.drawImage(img, 
                pixelInfo.sx, pixelInfo.sy, pixelInfo.sWidth, pixelInfo.sHeight,
                pixelInfo.sx, pixelInfo.sy, pixelInfo.sWidth, pixelInfo.sHeight
            );

            fireEventCallback();
        }, false);

        var replaceData = {area_id: targetAreaId, z: coords.z, x: coords.x, y: coords.y};
        var replacedUrl = this._myBuildUrl(myTileUrl, replaceData);
        img.src = replacedUrl;
    },

    _myBuildUrl: function(urlTemplate, replaceData) {
        return L.Util.template(urlTemplate, replaceData);
    },

});

L.gridLayer.oldEditionMap = function(options) {
    return new L.GridLayer.OldEditionMap(options);
};
