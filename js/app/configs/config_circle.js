(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};
    MyApp.configCircle = {};

    MyApp.configCircle.infoList = [
        {
            radiusKm: 0.05,
            caption: '半径50m',
            always: false,
            geZoom: 17,
        },
        {
            radiusKm: 0.1,
            caption: '半径100m (東京ドーム)',
            always: false,
            geZoom: 14,
        },
        {
            radiusKm: 0.25,
            caption: '半径250m',
            always: false,
            geZoom: 16,
        },
        {
            radiusKm: 0.5,
            caption: '半径500m',
            always: false,
            geZoom: 15,
        },
        {
            radiusKm: 1,
            caption: '半径1km (徒歩時速4kmで中心から15分の範囲)',
            always: false,
            geZoom: 14,
        },
        {
            radiusKm: 2,
            caption: '半径2km (徒歩時速4kmで中心から30分の範囲)',
            always: false,
            geZoom: 12,
        },
        {
            radiusKm: 4,
            caption: '半径4km (徒歩時速4kmで中心から1時間の範囲)',
            always: false,
            geZoom: 10,
        },
        {
            radiusKm: 10,
            caption: '半径10km',
            always: true,
            geZoom: 0,
        },
        {
            radiusKm: 20,
            caption: '半径20km',
            always: true,
            geZoom: 0,
        },
        {
            radiusKm: 50,
            caption: '半径50km',
            always: true,
            geZoom: 0,
        },
        {
            radiusKm: 100,
            caption: '半径100km',
            always: true,
            geZoom: 0,
        },
        {
            radiusKm: 150,
            caption: '半径150km',
            color: '#66F',
            always: true,
            geZoom: 0,
        },
    ];

}(this));
