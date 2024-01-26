async function initMyApp(global) {

    var gaChannel = new MyApp.Ga4Channel();
    var gaRepo = new MyApp.Ga4Repo(gaChannel, global);
    gaRepo.doSubscription();

    var myChannel = new MyApp.MyChannel();

    MyApp.AdvancedDialogManager.settingPopupBodyHtml();
    var permanentCacheStatusRepo = new MyApp.PermanentCacheStatusRepo(MyApp.globalState);
    var permanentCacheManager = new MyApp.PermanentCacheManager(gaChannel, MyApp.globalState, permanentCacheStatusRepo, global.navigator, global.location);
    permanentCacheManager.init();
    var currentCacheType = await permanentCacheManager.findCurrentCacheType();

    var mapManager = new MyApp.MapManager(MyApp.configMap, currentCacheType);
    var mapBoth = mapManager.init();

    var routelineManager = new MyApp.RoutelineManager(gaChannel, mapBoth, MyApp.globalState, myChannel);
    routelineManager.init();

    var seaSurfaceManager = new MyApp.SeaSurfaceManager(gaChannel, mapBoth, MyApp.globalState);
    seaSurfaceManager.init();

    var prefBorderManager = new MyApp.PrefectureBorderManager(mapBoth, MyApp.globalState, myChannel);
    prefBorderManager.init();

    var markerRecommend100MeizanManager = new MyApp.MarkerRecommend100MeizanManager(gaChannel, mapBoth);
    markerRecommend100MeizanManager.init();

    var urlRepo = new MyApp.UrlRepo(global.location);
    var urlQueryParamRepo = urlRepo.getUrlQueryParamRepo();

    var distanceCircleInfoProvider = new MyApp.DistanceCircleInfoProvider(MyApp.configCircle);
    var distanceCircleFactory = new MyApp.DistanceCircleFactory(distanceCircleInfoProvider);
    var oldEditionMapIdRepo = new MyApp.OldEditionMapIdRepo(currentCacheType);
    var clickManager = new MyApp.ClickManager(mapBoth, MyApp.globalState, myChannel, distanceCircleFactory, oldEditionMapIdRepo);
    clickManager.init();

    var urlCopyManager = new MyApp.UrlCopyManager(gaChannel, mapBoth, MyApp.globalState, urlRepo, seaSurfaceManager, clickManager, global.navigator);
    urlCopyManager.init();

    var initialSetViewManager = new MyApp.InitialSetViewManager(gaChannel, mapBoth, MyApp.globalState, urlQueryParamRepo, seaSurfaceManager, clickManager);
    initialSetViewManager.init();

    var recommendDialogManager = new MyApp.RecommendDialogManager(gaChannel, initialSetViewManager);
    recommendDialogManager.init();
    var recommendDialogDragHandler = new MyApp.RecommendDialogDragHandler(global);
    recommendDialogDragHandler.init();

    var advancedDialogManager = new MyApp.AdvancedDialogManager(gaChannel, permanentCacheManager);
    advancedDialogManager.init();
    var advancedDialogDragHandler = new MyApp.AdvancedDialogDragHandler(global);
    advancedDialogDragHandler.init();

    var searchLatLngManager = new MyApp.SearchLatLngManager(gaChannel, mapBoth, MyApp.globalState, myChannel, clickManager);
    searchLatLngManager.init();

    mapBoth.mapLeft.fire('overlayadd');
}

initMyApp(this);
