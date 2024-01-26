(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.UrlRepo = class UrlRepo {
        constructor(location) {
            this.window_location = location;
            this.origin = this.window_location.origin;
            this.appName = this.window_location.pathname;

            var search = this.window_location.search;
            this.urlQueryParamRepo = MyApp.UrlQueryParamRepo.createFrom(search);
        }


        getAppUrlPart() {
            return `${this.origin}${this.appName}`;
        }

        getQueryValueBy(queryKey) {
            var value = this.urlQueryParamRepo.getQueryValueBy(queryKey);
            return value;
        }

        getUrlQueryParamRepo() {

            MyApp.UtilDeepFreeze.execute(this.urlQueryParamRepo);
            return this.urlQueryParamRepo;
        }

    };

}(this));
