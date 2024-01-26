(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UtilCalcForTile = class UtilCalcForTile {

        static TILE_SIZE = {x:256, y:256};

        constructor() {
        }

        static calcTileXYInfoByZoomContaining(map, minZoom, maxZoom, pointsOfNwSe) {
            var list = [];



            for (var z = minZoom; z <= maxZoom; z++) {
                var nwTileXY = UtilCalcForTile.calcTileXY(map, UtilCalcForTile.TILE_SIZE, z, pointsOfNwSe.nw);
                var seTileXY = UtilCalcForTile.calcTileXY(map, UtilCalcForTile.TILE_SIZE, z, pointsOfNwSe.se);
                list.push({
                    z: z,
                    minTileX: nwTileXY.x,
                    maxTileX: seTileXY.x,
                    minTileY: nwTileXY.y,
                    maxTileY: seTileXY.y
                });
            }
            return list;
        }

        static calcTileXY(map, tileSize, targetZoom, latLngPoint) {
            var point = map.project(latLngPoint, targetZoom);
            var tileXY = point.unscaleBy(tileSize);
            var x = Math.floor(tileXY.x);
            var y = Math.floor(tileXY.y);
            return {x: x, y: y};
        }

        static calcTileXYFromLatlng(map, targetZoom, latLngPoint) {
            return UtilCalcForTile.calcTileXY(map, UtilCalcForTile.TILE_SIZE, targetZoom, latLngPoint);
        }

        static calcTotalTileCount(list) {
            var total = 0;
            var len = list.length;
            for (var i = 0; i < len; i++) {
                var obj = list[i];
                var xCount = obj.maxTileX - obj.minTileX + 1;
                var yCount = obj.maxTileY - obj.minTileY + 1;
                var count = xCount * yCount;
                total += count;
            }
            return total;
        }

        
    };

}(this));
