(function(global) {
    var MyApp = global.MyApp = global.MyApp || {};

    MyApp.RecommendDialogManager = class RecommendDialogManager {
        constructor(gaChannel, initialSetViewManager) {
            this.gaChannel = gaChannel;
            this.initialSetViewManager = initialSetViewManager;
            this.url = {
                recommend: 'json/recommend_place.json',
            };
            this.isFirstShow = false;
            this.initWidth = 0;
            this.initHeight = 0;
        }

        async init() {
            this.settingPopupShowBtn();
            this.settingPopupCloseBtn();
            var placeJson = await this.findPlaceData();
            this.createListArea(placeJson);
        }

        settingPopupShowBtn() {
            var self = this;
            var btnEl = document.querySelector('.js-recommend-place-show-btn');
            btnEl.addEventListener('click', function() {
                var areaEl = document.querySelector('.js-recommend-place-area');
                areaEl.style.display = 'block';
                if (self.isFirstShow === false) {
                    self.isFirstShow = true;
                    self._backupDialogSize(areaEl);
                }else{
                    self._restoreDialogSize(areaEl);
                    self._hiddenAllCategories();
                }
                self.gaChannel.publish('recommend_mitemiru');
            }, false);
        }
        settingPopupCloseBtn() {
            var btnElList = document.querySelectorAll('.js-recommend-place-close-btn');
            btnElList.forEach(function(btnEl) {
                btnEl.addEventListener('click', function() {
                    var areaEl = document.querySelector('.js-recommend-place-area');
                    areaEl.style.display = 'none';
                }, false);
            });
        }

        _backupDialogSize(areaEl) {
            var width = areaEl.getBoundingClientRect().width;
            var height = areaEl.getBoundingClientRect().height;
            this.initWidth = width;
            this.initHeight = height;
        }
        _restoreDialogSize(areaEl) {
            areaEl.style.width = this.initWidth + 'px';
            areaEl.style.height = this.initHeight + 'px';
        }
        _hiddenAllCategories() {
            var rootEl = document.querySelector('.js-recommend-place-area .js-recommend-place-list');
            var categoryOpenMarkElList = rootEl.querySelectorAll('.category-open-mark');
            categoryOpenMarkElList.forEach(function(el) {
                el.classList.remove('display-none');
            });
            var categoryCloseMarkElList = rootEl.querySelectorAll('.category-close-mark');
            categoryCloseMarkElList.forEach(function(el) {
                el.classList.add('display-none');
            });
            var categoryBodyElList = rootEl.querySelectorAll('.category-body');
            categoryBodyElList.forEach(function(el) {
                el.classList.add('display-none');
            });
        }

        async findPlaceData() {
            var res = await fetch(this.url.recommend);
            return res.json();
        }

        createListArea(placeJson) {
            var self = this;
            var rootEl = document.querySelector('.js-recommend-place-area .js-recommend-place-list');

            var categoryList = placeJson.categoryList;
            var categoryListLen = categoryList.length;
            for (var i = 0; i < categoryListLen; i++) {
                var category = categoryList[i];
                var categoryDivideEl = document.createElement('hr');
                if (category.highlightSeparator) {
                    categoryDivideEl.classList.add('category-highlight-separator');
                }
                rootEl.appendChild(categoryDivideEl);
                var categoryUnitEl = document.createElement('div');
                categoryUnitEl.classList.add('category-unit');
                rootEl.appendChild(categoryUnitEl);
                var categoryNameEl = document.createElement('div');
                categoryNameEl.classList.add('category-name');
                categoryNameEl.innerText = category.categoryName;
                categoryUnitEl.appendChild(categoryNameEl);
                var categoryOpenMarkEl = document.createElement('span');
                categoryOpenMarkEl.classList.add('category-open-mark');
                categoryOpenMarkEl.innerText = '▼';
                categoryNameEl.appendChild(categoryOpenMarkEl);
                var categoryCloseMarkEl = document.createElement('span');
                categoryCloseMarkEl.classList.add('category-close-mark', 'display-none');
                categoryCloseMarkEl.innerText = '▲';
                categoryNameEl.appendChild(categoryCloseMarkEl);
                var categoryBodyEl = document.createElement('div');
                categoryBodyEl.classList.add('category-body', 'display-none');
                categoryUnitEl.appendChild(categoryBodyEl);
                (function(categoryNameEl, categoryBodyEl, categoryOpenMarkEl, categoryCloseMarkEl) {
                    categoryNameEl.addEventListener('click', function() {
                        categoryBodyEl.classList.toggle('display-none');
                        categoryOpenMarkEl.classList.toggle('display-none');
                        categoryCloseMarkEl.classList.toggle('display-none');
                    }, false);
                }(categoryNameEl, categoryBodyEl, categoryOpenMarkEl, categoryCloseMarkEl));
                var categoryNoteEl = document.createElement('div');
                categoryNoteEl.classList.add('category-note');
                categoryNoteEl.innerText = category.categoryNote;
                categoryBodyEl.appendChild(categoryNoteEl);

                var placeListEl = document.createElement('div');
                placeListEl.classList.add('place-list');
                categoryBodyEl.appendChild(placeListEl);

                var placeList = category.placelist;
                var len = placeList.length;
                for (var j = 0; j < len; j++) {
                    var place = placeList[j];
                    var placeUnitEl = document.createElement('div');
                    placeUnitEl.classList.add('place-unit');
                    placeListEl.appendChild(placeUnitEl);
                    var wrapNumEl = document.createElement('div');
                    placeUnitEl.appendChild(wrapNumEl);
                    var numEl = document.createElement('span');
                    numEl.classList.add('place-num');
                    numEl.innerText = place.num;
                    wrapNumEl.appendChild(numEl);
                    var wrapBodyEl = document.createElement('div');
                    placeUnitEl.appendChild(wrapBodyEl);
                    var noteEl = document.createElement('span');
                    noteEl.classList.add('place-note');
                    noteEl.innerText = place.note;
                    wrapBodyEl.appendChild(noteEl);
                    var btnEl = document.createElement('input');
                    btnEl.type = 'button';
                    btnEl.classList.add('place-btn');
                    btnEl.value = '見る';
                    (function(btnEl, url, resourceId) {
                        btnEl.addEventListener('click', function() {
                            self.showTargetArea(url);
                            self.clearHighlightBtn();
                            self.highlightBtn(btnEl);
                            self.gaChannel.publishForData(`recommend_place_${resourceId}`);
                        }, false);
                    }(btnEl, place.url, place.resourceId));
                    wrapBodyEl.appendChild(btnEl);
                    if (place.note2) {
                        var brEl = document.createElement('br');
                        wrapBodyEl.appendChild(brEl);
                        var note2El = document.createElement('span');
                        note2El.classList.add('place-note2');
                        note2El.innerText = place.note2;
                        wrapBodyEl.appendChild(note2El);
                    }
                }
            }
        }

        showTargetArea(url) {
            var search = this._retrieveSearchPartText(url);
            var urlQueryParamRepo = MyApp.UrlQueryParamRepo.createFrom(search);

            var setViewManager = this.initialSetViewManager.createWith(urlQueryParamRepo);
            var isRecommendShow = true;
            setViewManager.init(isRecommendShow);
        }

        _retrieveSearchPartText(url) {
            var index = url.indexOf('?');
            if (index < 0) {
                alert(`[Bug]URLにQueryParameterなし [${url}]`);
            }
            var searchPartText = url.substring(index);
            return searchPartText;
        }

        clearHighlightBtn() {
            var rootEl = document.querySelector('.js-recommend-place-area .js-recommend-place-list');
            var btnElList = rootEl.querySelectorAll('.place-btn');
            btnElList.forEach(function(btnEl) {
                btnEl.classList.remove('btn-highlight');
            });
        }
        highlightBtn(btnEl) {
            btnEl.classList.add('btn-highlight');
        }

    };

}(this));
