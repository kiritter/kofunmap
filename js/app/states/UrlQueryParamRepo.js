(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UrlQueryParamRepo = class UrlQueryParamRepo {
        constructor(queryKeyValueMap) {
            this.queryKeyValueMap = queryKeyValueMap;
        }

        static createFrom(searchPartText) {
            var queryKeyValueMap = UrlQueryParamRepo._buildQueryKeyValueMap(searchPartText);
            return new UrlQueryParamRepo(queryKeyValueMap);
        }

        hasAnyQueryParams() {
            var count = Object.keys(this.queryKeyValueMap).length
            return (count > 0);
        }

        getQueryValueBy(queryKey) {
            var value = this.queryKeyValueMap[queryKey];
            return value;
        }

        static _buildQueryKeyValueMap(searchPartText) {
            if (searchPartText === '') {
                return {};
            }
            var search = searchPartText;
            var withoutQuestion = search.substring(1);
            var keyValueList = withoutQuestion.split('&');
            var keyValueMap = {};
            keyValueList.forEach((element) => {
                var keyValue = element.split('=');
                if (keyValueMap[keyValue[0]]) {
                    if (Array.isArray(keyValueMap[keyValue[0]])) {
                        keyValueMap[keyValue[0]].push(keyValue[1]);
                    }else{
                        var firstValue = keyValueMap[keyValue[0]];
                        keyValueMap[keyValue[0]] = [firstValue, keyValue[1]];
                    }
                }else{
                    keyValueMap[keyValue[0]] = keyValue[1];
                }
            });
            return keyValueMap;
        }

        getClone() {
            var copiedData = Object.assign({}, this.queryKeyValueMap);
            var newInstance = new UrlQueryParamRepo(copiedData);
            return newInstance;
        }

        addQueryKeyValue(queryKey, queryValue) {
            this.queryKeyValueMap[queryKey] = queryValue;
        }

    };

}(this));
