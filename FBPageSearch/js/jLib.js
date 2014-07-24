/**
 * Simple Helper Library
 */
var jL = {
    /**
     * Document ready event Handler
     * @param {function} callback
     */
    onReady: function(callback) {
        document.addEventListener('DOMContentLoaded', callback, false);
    },
    /**
     * Get an element by ID
     * @param {type} id
     * @param {type} node
     * @returns {HTMLElement}
     */
    byID: function(id, node) {
        return (node ? node : document).getElementById(id);
    },
    /**
     * Get all elements by class name
     * @param {string} c
     * @param {HTMLElement} node
     * @returns {HTMLCollection}
     */
    byClass: function(c, node) {
        return (node ? node : document).getElementsByClassName(c);
    },
    /**
     * Get elements by tag name
     * @param {string} t
     * @param {HTMLElement} node
     * @returns {HTMLCollection}
     */
    byTag: function(t, node) {
        return (node ? node : document).getElementsByTagName(t);
    },
    /**
     * Attach event handler to node
     * @param {HTMLElement} node
     * @param {function} handler
     */
    onClick: function(node, handler) {
        node.addEventListener('click', handler, false);
    },
    /**
     * Check element has the class
     * @param {HTMLElement} node
     * @param {string} c
     * @returns {Boolean}
     */
    hasClass: function(node, c) {
        return node.className.indexOf(c) >= 0;
    },
    /**
     * Create a new HTMLElement
     * @param {string} tag
     * @param {object} attrs
     * @param {string} html
     * @returns {HTMLElement}
     */
    el: function(tag, attrs, html) {
        var e = document.createElement(tag);
        if (attrs)
            for (var i in attrs) {
                if (attrs.hasOwnProperty(i)) {
                    e.setAttribute(i, attrs[i]);
                }
            }
        if (html) {
            e.innerHTML = html;
        }
        return e;
    },
    /**
     * Remove a class form element
     * @param {HTMLElement} node
     * @param {string} c    
     */
    removeClass: function(node, c) {
        node.className = node.className.replace(c, '');
    },
    /**
     * Add a class to element
     * @param {HTMLElement} node
     * @param {string} c
     */
    addClass: function(node, c) {
        node.className = node.className + " " + c;
    },
    prefix: 0,
    /**
     * Create a JSON P call
     * @param {string} url
     * @param {function} callabck
     * @param {object} data
     */
    jsonp: function(url, callabck, data) {
        var funName = 'jsonpcallback_' + this.prefix;
        this.prefix++;
        window[funName] = function(response) {
            callabck(response);
        };
        var q = "?callback=" + funName;
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                q += "&" + i + "=" + data[i];
            }
        }
        var script = document.createElement('script');
        script.src = url + q;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

};

