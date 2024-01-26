(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};
    MyApp.configMap = {};

    MyApp.configMap.TileType = {
        Empty: 1,
        Standard: 2,
        Colorized: 3,
        OldEdition: 4,
        MyZxy: 5,
    };

    MyApp.configMap.MapLeftBaseList = [
        {name: 'osm', selected: true},
    ];
    MyApp.configMap.MapLeftOverlayList = [
        {name: 'old_edition', selected: false},
        {name: 'ort_old10', selected: false},
        {name: 'latest', selected: true},
        {name: 'hillshade', selected: true},
        {name: 'dem5a', selected: true},
        {name: 'pref_border', selected: false},
        {name: 'layer_kofun', selected: true},
        {name: 'layer_spot_main', selected: true},
        {name: 'layer_spot_sub', selected: true},
        {name: 'recommend_100meizan', selected: false},
    ];

    MyApp.configMap.LayerConfigTable = {
        'osm': {
            caption: 'OpenStreetMap',
            options: {
                myTileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
                crossOrigin: 'anonymous',
                minZoom: 5,
                maxZoom: 18,
                maxNativeZoom: 18,
                myLayerName: 'osm',
                myCacheName: 'osm',
                myCacheRepo: MyApp.globalCacheRepo,
            },
        },


        'ort_old10': {
            caption: '1961-1969年(昭和36-44年) (Zoom:10-17)',
            options: {
                myTileUrl: 'https://cyberjapandata.gsi.go.jp/xyz/ort_old10/{z}/{x}/{y}.png',
                attribution: `<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>`,
                crossOrigin: 'anonymous',
                minZoom: 5,
                maxZoom: 18,
                maxNativeZoom: 17,
                isSingleChoiceLayer: true,
                myLayerName: 'ort_old10',
                myCacheName: 'ort_old10',
                myCacheRepo: MyApp.globalCacheRepo,
            },
        },
        'latest': {
            caption: '最新 (Zoom:5-8,9-13,14-18)',
            options: {
                myTileUrl: 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
                attribution: `<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>`,
                crossOrigin: 'anonymous',
                minZoom: 5,
                maxZoom: 18,
                maxNativeZoom: 18,
                isSingleChoiceLayer: true,
                myLayerName: 'latest',
                myCacheName: 'latest',
                myCacheRepo: MyApp.globalCacheRepo,
            },
        },
        'hillshade': {
            caption: '陰影起伏図 (Zoom:5-16)',
            options: {
                myTileUrl: 'https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png',
                attribution: `<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>`,
                crossOrigin: 'anonymous',
                minZoom: 5,
                maxZoom: 18,
                maxNativeZoom: 16,
                opacity: 0.5,
                myLayerName: 'hillshade',
                myCacheName: 'hillshade',
                myCacheRepo: MyApp.globalCacheRepo,
                addSeparatorToBeforebegin: true,
                blockDescription: '重ねて表示できます',
                blockDescriptionCssClassName: 'block-description',
            },
        },

        'old_edition': {
            caption: '旧版地図(五万分一地形圖) (Zoom:10-15)',
            tileType: MyApp.configMap.TileType.OldEdition,
            options: {
                myTileUrl: 'https://mapwarper.h-gis.jp/maps/tile/{area_id}/{z}/{x}/{y}.png',
                attribution: `<a href='https://mapwarper.h-gis.jp/about' target='_blank'>日本版MapWarper</a>`,
                minZoom: 10,
                maxZoom: 18,
                maxNativeZoom: 15,
                isSingleChoiceLayer: true,
                myLayerName: 'old_edition',
                myCacheName: 'old_edition',
                myCacheRepo: MyApp.globalCacheRepo,
                myOldEditionMapIdLocalRepo: MyApp.oldEditionMapIdLocalRepo,
                myOldEditionMapIdCacheRepo: MyApp.oldEditionMapIdCacheRepo,
                blockDescription: '戦前期の地図、航空写真を表示できます（いずれか1つ）',
                blockDescriptionCssClassName: 'block-description',
            },
        },

        'dem5a': {
            caption: '海面上昇イメージ (標高(DEM5A)) (Zoom:5-15)',
            tileType: MyApp.configMap.TileType.Colorized,
            url: 'https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/{z}/{x}/{y}.png',
            options: {
                attribution: `<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>`,
                minZoom: 5,
                maxZoom: 18,
                maxNativeZoom: 15,
                myLayerName: 'dem5a',
                myCacheName: 'dem5a',
                myCacheRepo: MyApp.globalCacheRepo,
                myStateRepo: MyApp.globalState,
                opacity: 0.7,
                colorize: function(pixel) {
                    var invalidValue = -99999;
                    var h = MyApp.configMapDemFunction.calcHeightForDem(pixel, invalidValue);

                    var this_options = this;
                    var seaSurfaceHeight = this_options.myStateRepo.seaSurfaceHeight;
                    if (MyApp.configMapDemFunction.aboveSeaSurface(h, seaSurfaceHeight, invalidValue)) {
                        return {r: 0, g: 0, b: 0, a: 0};
                    }else{
                        return MyApp.configMapDemFunction.calcSeaColorForDem(h, seaSurfaceHeight);
                    }
                },
            },
        },

        'layer_kofun': {
            caption: '古墳',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: `layer_kofun`,
                overlayMenuCssClassName: 'overlay-menu-kohun',
                addSeparatorToBeforebegin: true,
                blockDescription: '大きなマーカーで表示します（クリックで内容表示）',
                blockDescriptionCssClassName: 'block-description',
            },
        },
        'layer_spot_main': {
            caption: '神社や周辺史跡、説明文',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'layer_spot_main',
                addSeparatorToBeforebegin: true,
                blockDescription: '小さなマーカーで表示します（自動で名称表示）',
                blockDescriptionCssClassName: 'block-description',
            },
        },
        'layer_spot_sub': {
            caption: '博物館や駅、目安となる施設',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'layer_spot_sub',
            },
        },
        'recommend_100meizan': {
            caption: 'おまけ：日本百名山',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'recommend_100meizan',
                isLastElement: true,
                lastElementLinkInfoList: [
                    {
                        sourceSummaryUrl: 'html/source_summary.html',
                        sourceSummaryText: '地図データの出典情報、参考文献情報',
                        sourceSummaryNote: '',
                        sourceSummaryCssClassName: 'source-summary-link',
                    },
                    {
                        sourceSummaryUrl: '../#product-map',
                        sourceSummaryText: '当Webサイトの🗾兄弟地図サイトを見る',
                        sourceSummaryNote: '',
                        sourceSummaryCssClassName: 'source-summary-link',
                    },
                ],
            },
        },
        'pref_border': {
            caption: '都道府県境 (目安, 2014年時点)',
            tileType: MyApp.configMap.TileType.Empty,
            options: {
                minZoom: 5,
                maxZoom: 18,
                myLayerName: 'pref_border',
            },
        },

    };

}(this));
