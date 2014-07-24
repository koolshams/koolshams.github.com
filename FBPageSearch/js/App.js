/**
 * Create Main App Constructor
 * @param settings - object - apiUrl
 */
var App = function(settings) {
    this.settings = settings;
};

/**
 * Defining App properties
 */
App.prototype = {
    /**
     * Initialise APP    
     */
    init: function() {
        //Store HTML Elements
        this.searchInput = jL.byID('search_input');
        this.searchButton = jL.byID('search_button');
        this.tokenInput = jL.byID('token_input');
        this.tokenButton = jL.byID('token_button');
        this.listUL = jL.byID('rs-results');
        this.favCount = jL.byID('fav-count');
        this.favLink = jL.byID('rs-favorites');
        //Binding Events
        jL.onClick(this.searchButton, this.search.bind(this));
        jL.onClick(this.listUL, this.viewDetails.bind(this));
        jL.onClick(this.tokenButton, this.saveToken.bind(this));
        jL.onClick(this.favLink, this.loadFav.bind(this));
        //this.listUL.on('click', 'li', $.proxy(this.viewDetails, this));
        //this.listUL.on('click', 'li a.fav', $.proxy(this.saveFav, this));

        //Load apiToken and Fav from local Storage
        this.loadStorage();
        this.loadFav();
    },
    /**
     * Loading Fav and accessToken form localstorage    
     */
    loadStorage: function() {
        this.settings.accessToken = "";
        this.favorites = {};
        var lf = localStorage.getItem('fav');
        var token = localStorage.getItem('app_token');
        if (lf) {
            this.favorites = JSON.parse(lf);
        }
        if (token) {
            this.settings.accessToken = token;
            this.tokenInput.value = token;
        }
        this.updateFavorites();
    },
    /**
     * For loading Favitems
     * @param {type} evt
     */
    loadFav: function(evt) {
        if (evt) {
            evt.preventDefault();
        }
        this.listUL.innerHTML = '';
        var len = 0;
        for (var i in this.favorites) {
            if (this.favorites.hasOwnProperty(i)) {
                len++;
                var li = jL.el('li', {id: 'page_' + i});
                li.innerHTML = '<a class="fav added" href="#" data-name="' +
                        this.favorites[i] + '" data-id="' + i + '"></a>' + this.favorites[i];
                this.listUL.appendChild(li);
            }
        }
        if (len === 0) {
            this.listUL.innerHTML = '<li class="rs-open">No Favorites</li>';
        }
    },
    /**
     * Save the current Fav to localstorage and update count
     */
    updateFavorites: function() {
        var len = 0;
        for (var i in this.favorites) {
            if (this.favorites.hasOwnProperty(i)) {
                len++;
            }
        }
        this.favCount.innerHTML = len + '';
        localStorage.setItem('fav', JSON.stringify(this.favorites));
    },
    /**
     * Add an item to Favourites. Event handler for star icon.
     * @param {type} evt
     */
    saveFav: function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var $a = evt.target;
        if (jL.hasClass($a, 'added')) {
            jL.removeClass($a, 'added');
            delete this.favorites[$a.getAttribute('data-id')];
        } else {
            jL.addClass($a, 'added');
            this.favorites[$a.getAttribute('data-id')] = $a.getAttribute('data-name');
        }
        this.updateFavorites();
    },
    /**
     * Event handler for save token button, save token to local storage
     * @param {type} evt
     */
    saveToken: function(evt) {
        var token = this.tokenInput.value;
        if (!token) {
            alert('Token cannot be empty');
            return;
        }
        localStorage.setItem('app_token', token);
        this.settings.accessToken = token;
    },
    /**
     * Search pages from FB API, event handler for search button
     */
    search: function() {
        var q = this.searchInput.value;
        if (q === '') {
            alert('query cannot be empty');
            return;
        }
        jL.jsonp(this.settings.apiUrl + '/search', this.loadSearch.bind(this), {
            q: q,
            type: 'page',
            method: 'GET',
            suppress_http_code: 1,
            format: "json",
            access_token: this.settings.accessToken
        });
    },
    /**
     * Display current results
     * @param {object} data
     */
    loadSearch: function(data) {
        if (data.error) {
            alert("Error while requesting " + data.error.message);
            return;
        }
        if (data.data.length === 0) {
            this.listUL.innerHTML = '<li class="rs-open">No results</li>';
            return;
        }
        this.listUL.innerHTML = '';
        //Sort array in descending order of the names
        var list = data.data.sort(function(a, b) {
            var aName = a.name.toLowerCase();
            var bName = b.name.toLowerCase();
            if (aName > bName) {
                return -1;
            }
            if (aName < bName) {
                return 1;
            }
            return 0;
        });

        for (var i = 0; i < list.length; i++) {
            var li = jL.el('li', {id: 'page_' + list[i].id});
            li.innerHTML = '<a class="fav" href="#" data-name="' + list[i].name + '" data-id="' + list[i].id + '"></a>' + list[i].name;
            this.listUL.appendChild(li);
        }
        for (var i in this.favorites) {
            if (this.favorites.hasOwnProperty(i)) {
                var a = jL.byClass('fav', jL.byID('page_' + i))[0];
                jL.addClass(a, 'added');
            }
        }
    },
    /**
     * Event handler for each page result item. call FB api to display details
     * @param {type} evt
     */
    viewDetails: function(evt) {
        var $target = evt.target;
        if ($target.tagName.toLowerCase() === 'li' && $target.getAttribute('id')) {
            var id = $target.getAttribute('id').replace('page_', '');
            if (jL.byTag('article', $target).length !== 0) {
                jL.removeClass($target, 'rs-open');
                $target.removeChild(jL.byTag('article', $target)[0]);
                return;
            }
            jL.jsonp(this.settings.apiUrl + id, this.loadDetails.bind(this), {
                method: 'GET',
                suppress_http_code: 1,
                format: "json",
                access_token: this.settings.accessToken
            });
        } else if ($target.tagName.toLowerCase() === 'a') {
            this.saveFav(evt);
        }

    },
    /**
     * Display page details in page.
     * @param {object} data    
     */
    loadDetails: function(data) {
        if (data.error) {
            alert("Error while requesting " + data.error.message);
            return;
        }
        var el = jL.el('article', {'class': 'rs-news-items'});
        var li = jL.byID('page_' + data.id);

        if (data.category) {
            el.appendChild(jL.el('p', {}, '<strong>Category :</strong> ' + data['category']));
        }
        if (data.about) {
            el.appendChild(jL.el('p', {}, '<strong>About :</strong> ' + data['about']));
        }
        if (data.description) {
            el.appendChild(jL.el('p', {}, '<strong>Description :</strong> ' + data['description']));
        }
        if (data.link) {
            el.appendChild(jL.el('p', {}, '<a href="' + data.link + '" target="_blank">Goto page</a>'));
        }
        var c=jL.byTag('article', li)[0];
        if(c){
            li.removeChild();
        }
        
        li.appendChild(el);
        jL.addClass(li, 'rs-open');
    }

};

//Create app Object
var app = new App({
    apiUrl: 'https://graph.facebook.com/v2.0/'
});

//Init app on page ready
jL.onReady(function() {
    app.init();
});