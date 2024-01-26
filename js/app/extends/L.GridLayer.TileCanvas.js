L.GridLayer.TileCanvas = L.GridLayer.extend({
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

    _myDrawToCanvas: function(tileCanvas, coords, myTileUrl) {

        var self = this;
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.addEventListener('load', function imgLoadHandler() {
            img.removeEventListener('load', imgLoadHandler);

            var ctx = tileCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            var propagate = false;
            self.fire('tile-image-loaded', {
                coords: coords,
                tileCanvas: tileCanvas,
            }, propagate);
        }, false);

        var replaceData = {z: coords.z, x: coords.x, y: coords.y};
        var replacedUrl = this._myBuildUrl(myTileUrl, replaceData);
        img.src = replacedUrl;
    },

    _myBuildUrl: function(urlTemplate, replaceData) {
        return L.Util.template(urlTemplate, replaceData);
    },

});

L.gridLayer.tileCanvas = function(options) {
    return new L.GridLayer.TileCanvas(options);
};
