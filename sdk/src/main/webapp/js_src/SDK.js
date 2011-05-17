(function(window) {

    var Gitana = window.Gitana;

    Gitana.SDK = Gitana.extend(
    /** @lends Gitana.SDK.prototype */
    {
        /**
         * @constructs
         *
         * @class Abstract base class for Gitana SDK services and objects.
         */
        constructor: function() {
            this.base();

            /**
             * Finds whether a variable is empty.
             *
             * @inner
             * @param {Any} obj The variable being evaluated.
             * @returns {Boolean} True if the variable is empty, false otherwise.
             */
            this.isEmpty = function(obj) {
                return typeof obj == "undefined" || obj == null;
            };

            /**
             * Finds whether the type of a variable is object.
             * @param {Any} obj The variable being evaluated.
             * @returns {Boolean} True if the variable is a object, false otherwise.
             */
            this.isObject = function(obj) {
                return (typeof obj == "object");
            };

            /**
             * Finds if a variable is a valid Gitana QName.
             *
             * @param {String} data The variable to be evaluated.
             * @returns {Boolean} True if the variable is a valid Gitana QName, false otherwise.
             */
            this.isValidQName = function (data) {
                return !this.isEmpty(data) && this.isString(data) && data.match(/^[0-9a-zA-Z-_]+:[0-9a-zA-Z-_]+$/);
            };

            /**
             * Finds if a variable is a valid Gitana ID.
             *
             * @param {String} data The variable to be evaluated.
             * @returns {Boolean} True if the variable is a valid Gitana ID, false otherwise.
             */
            this.isValidGitanaId = function (data) {
                return !this.isEmpty(data) && this.isString(data) && data.match(/^[0-9a-z]{32}$/);
            };
        }

    });

})(window);