(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.MarkerRecommend100MeizanManager = class MarkerRecommend100MeizanManager {
        constructor(gaChannel, mapBoth) {
            var layerName = 'recommend_100meizan';
            var url = 'geojson/01_recommend_places/100meizan.geojson';
            var contentCallback = MarkerRecommend100MeizanManager._buildMarkerPopupContent;
            var options = {
                markerClassName: 'marker-gray',
            };
            this.coreManager = new MyApp.MarkerRecommendCoreManager(gaChannel, mapBoth, layerName, url, contentCallback, options);
        }

        async init() {
            this.coreManager.init();
        }

        static _buildMarkerPopupContent(properties) {
            var content = `
<table class="meizan-table">
    <tbody>
        <tr>
            <th>番号</th>
            <td>${properties.num}</td>
        </tr>
        <tr>
            <th>山名</th>
            <td>${properties.name}</td>
        </tr>
        <tr>
            <th>よみ</th>
            <td>${properties.yomi}</td>
        </tr>
        <tr>
            <th>標高(m)</th>
            <td>${properties.elevation}</td>
        </tr>
        <tr>
            <th>山系</th>
            <td>${properties.system}</td>
        </tr>
        <tr>
            <th>都道府県</th>
            <td>${properties.todofuken}</td>
        </tr>
        <tr>
            <th class="meizan-desc-caption">備考</th>
            <td class="meizan-desc-content">${properties.desc}</td>
        </tr>
    </tbody>
</table>
`;
            return content;
        }
    };

}(this));
