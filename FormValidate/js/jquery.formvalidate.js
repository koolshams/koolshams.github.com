(function ($) {
    //Built in rules
    var rules = {
        number: {
            type: 'pattern',
            pattern: /\d+/,
            errorMessage: "Field is invalid, please enter a valid number"
        },
        email: {
            type: 'pattern',
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            errorMessage: "Invalid email, please enter a valid email"
        },
        required: {
            type: 'pattern',
            pattern: /.+/i,
            errorMessage: "Please enter something"
        }
    };

    var defaultOptions = {
        attributeUsed: "data-form-validate",
        triggerUsed: "blur",
        focusFirstField: true,
        hideErrorOnChange: false,
        scroll: true
    };

    /**
     * Formvaldate function.
     * @param {HTMLFormElement} form
     * @param {object} options
     * @returns {undefined}
     */
    function FormValidate(form, options) {
        var $form = $(form);
        //Fill options with defaults
        options = $.extend({}, defaultOptions, options);
        var formElements = $form.find('input['+options.attributeUsed+']');
        var validations = [];

        /**
         * Scroll to element
         * @param {HTMLElement} el
         * @returns {undefined}
         */
        function scrollTo(el) {
            $(document).scrollTop($(el).offset.top);
        }

        /**
         * Submit event handler for form
         * @param {Event} evt
         * @returns {Boolean} false
         */
        function formSubmitHandler(evt) {
            var isValid = true; //validation flag
            var firstErrorElement = null;

            /**
             * Recursive function to loop validations over validations array
             * @param {int} index
             * @returns {undefined}
             */
            function loopValidation(index) {
                if (!validations[index]) { // check for validation complete
                    if (isValid) {
                        form.submit(); //submit form if validation success
                    } else {
                        // scroll to element if validation failed and scroll is enabled
                        if (options.scroll && firstErrorElement) {
                            scrollTo(firstErrorElement);
                        }
                        if (options.focusFirstField && firstErrorElement) {
                            firstErrorElement.focus();
                        }
                    }
                    return;
                }
                //call validation functions one by one
                validations[index].call({}, function () {
                    loopValidation(index + 1);
                }, function () {
                    isValid = false;
                    if (!firstErrorElement) {
                        firstErrorElement = formElements[index];
                    }
                    loopValidation(index + 1);
                });
            }

            loopValidation(0);
            evt.preventDefault();
            return false;
        }

        function createErrorElement() {
            return $('<span class="error"></span>');
        }

        function showError(el, errorEl) {
            $(el).addClass('error').removeClass('valid');
            errorEl.insertAfter(el);
        }

        function hideError(el, errorElement) {
            $(el).addClass('valid').removeClass('invalid');
            errorElement.remove();
        }

        /**
         * Get validator function for an element
         * @param {HTMLElement} el
         * @returns {Function}
         */
        function getValidator(el) {
            var rule = $(el).attr(options.attributeUsed);
            if (rules[rule]) { // check for rule is available
                var errorElement = createErrorElement();
                if (options.hideErrorOnChange) {
                    $(el).off('keyup.validate').on('keyup.validate', function(){
                        hideError(el, errorElement);
                    });
                }
                if (rules[rule].type === 'pattern') { // validator for pattern
                    function handler(success, error) {
                        if (rules[rule].pattern.test(el.value)) {
                            hideError(el, errorElement);
                            success();
                        } else {
                            errorElement.text(rules[rule].errorMessage);
                            showError(el, errorElement);
                            error();
                        }
                    }
                    // add pattern validator to triggerEvent
                    $(el).off(options.triggerUsed + '.validator').on(options.triggerUsed + '.validator', function () {
                        handler(function () {
                        }, function () {
                        });
                    });
                    return handler;
                } else if (rules[rule].type === 'async') { //async validators
                    return function (success, error) {
                        rules[rule].callback.call({}, el, function () {
                            hideError(el, errorElement);
                            success();
                        }, function (msg) {
                            errorElement.text(msg);
                            showError(el, errorElement);
                            error();
                        });
                    };

                }
            } else {
                throw rule + ': Rule not found';
            }
        }

        function init() {
            formElements.each(function () {
                validations.push(getValidator(this));
            });
            $form.off('submit.validator').on('submit.validator', formSubmitHandler);
        }

        init();

    }

    //Create jquery plugin for validation
    $.fn.formValidate = function (options) {
        $(this).each(function () {
            FormValidate(this, options);
        });
    };

    //Create add rule
    $.formValidate = {
        addRule: function (name, options) {
            rules[name] = options;
        }
    };

})(jQuery);