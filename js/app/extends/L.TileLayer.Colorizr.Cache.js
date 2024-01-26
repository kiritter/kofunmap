L.TileLayer.Colorizr.Cache = L.TileLayer.Colorizr.extend({

    _myGetKey: function(z, x, y) {
        var key = `${this._MY_CACHE_NAME}-${z}/${x}/${y}`;
        return key;
    },

    myHasCache: async function(z, x, y) {
        var key = this._myGetKey(z, x, y);
        var exists = await this._cacheRepo.exists(key)
        return exists;
    },

    initialize: function(url, options) {
        this._MY_LAYER_NAME = options.myLayerName;
        this._MY_CACHE_NAME = options.myCacheName;

        L.TileLayer.Colorizr.prototype.initialize.call(this, url, options);

        this._cacheRepo = options.myCacheRepo;

    },

    getTileUrl(coords) {

        var imgUrlAsWebApi = L.TileLayer.Colorizr.prototype.getTileUrl.call(this, coords);

        var key = this._myGetKey(coords.z, coords.x, coords.y);
        var self = this;
        this._cacheRepo.findBy(key)
            .then((dataUrl) => {
                var key = self._tileCoordsToKey(coords);
                var tile = self._tiles[key];
                if (tile) {
                    var imgEl = tile.el;
                    if (dataUrl) {
                        imgEl.src = dataUrl;
                    }else{
                        imgEl.src = imgUrlAsWebApi;
                    }
                }else{
                }
            });
        return '';
    },

    _colorize: function (img, coords) {
        if (img.getAttribute('data-colorized')) {
            return;
        }

        var canvas = this._myCreateCanvasFrom(img);

        L.TileLayer.Colorizr.prototype._colorize.call(this, img);

        var key = this._myGetKey(coords.z, coords.x, coords.y);
        var self = this;
        this._cacheRepo.exists(key)
            .then((exists) => {
                if (exists) {
                }else{
                    var dataUrl = self._myCreateDataUrlFrom(canvas);
                    self._myInsertCache(dataUrl, coords);
                }
            });
    },

    _myCreateCanvasFrom(img) {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        return canvas;
    },
    _myCreateDataUrlFrom(canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        return dataUrl;
    },

    _myInsertCache(dataUrl, coords) {
        var key = this._myGetKey(coords.z, coords.x, coords.y);
        this._cacheRepo.save(key, dataUrl);
    },

});

L.tileLayer.colorizr.cache = function(url, options) {
    return new L.TileLayer.Colorizr.Cache(url, options);
};
