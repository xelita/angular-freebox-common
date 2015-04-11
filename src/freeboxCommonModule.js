/**
 * Angular Module relying on Freebox OS API.
 * http://dev.freebox.fr/sdk/os/
 */
var fbCommonModule = angular.module('fbCommonModule', []);

// Constants

/**
 * Constants service used in the whole module.
 */
fbCommonModule.constant('fbCommonConstants', {
    box: {
        localUrl: 'http://mafreebox.freebox.fr'
    },
    urls: {
        apiVersion: '/api_version'
    }
});

// Services

/**
 * Main service of the module.
 */
fbCommonModule.factory('fbCommonService', ['$log', '$http', '$q', 'fbCommonConstants', function ($log, $http, $q, fbCommonConstants) {
    return {
        /**
         * Return the box url: remote or local (http://mafreebox.freebox.fr)
         *
         * @see http://dev.freebox.fr/sdk/os/#discovery-using-http
         * @param url the remote box url (optional)
         * @return the remote box url if provided or the local one if omitted
         */
        targetRootUrl: function (url) {
            $log.debug('fbCommonService.targetRootUrl.');
            return url ? url : fbCommonConstants.box.localUrl;
        },

        /**
         * Return the freebox current api version.
         * @see http://dev.freebox.fr/sdk/os/#api-version
         *
         * @param url the box url (option for local requests)
         * @return HttpPromise
         */
        apiVersion: function (url) {
            $log.debug('fbCommonService.apiVersion.');
            return $http.get(this.targetRootUrl(url) + fbCommonConstants.urls.apiVersion);
        },

        /**
         * Return the full api request url.
         * @see http://dev.freebox.fr/sdk/os/#discovery-using-http
         *
         * @param apiUrl the api url
         * @param boxUrl the box url
         * @return the full api url (http://[freebox_ip]:[freebox_port]/[api_base_url]/v[major_api_version]/[api_url])
         */
        apiRequestUrl: function (apiUrl, boxUrl) {
            $log.debug('fbCommonService.apiRequestUrl.');

            // Deferred object
            var deferred = $q.defer();

            // Get the target url to invoke
            var rootUrl = this.targetRootUrl(boxUrl);
            $log.debug('rootUrl is: ' + rootUrl);

            // Get the api version to build the request url
            this.apiVersion(rootUrl).then(function (response) {
                // API information
                var apiInfo = response.data;
                $log.debug('API information is: ' + apiInfo);

                // Request URL
                var requestUrl = rootUrl + apiInfo.api_base_url + 'v' + apiInfo.api_version.charAt(0) + apiUrl;
                $log.debug('requestUrl is: ' + requestUrl);

                // Resolving promise
                deferred.resolve(requestUrl);
            });

            // Returning promise
            return deferred.promise;
        }
    };
}]);