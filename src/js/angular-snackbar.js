'use strict';
angular.module('snackbar', [])
  .run(['$templateCache', function ($templateCache) {
    var snackbarTemplate = '<div class="snackbar-container" ng-class="{ show: snackbar.show }">' +
      '<div class="snackbar-message">{{ snackbar.message }}</div>' +
      '<div class="snackbar-buttons"><button ng-click="button.onClick()" ng-repeat="button in snackbar.buttons">{{ button.text }}</button></div>' +
      '</div>';

    $templateCache.put('snackbar-template.html', snackbarTemplate);
  }])

  .provider('snackbar', function () {

    this.$get = ['$compile', '$document', '$interval', '$rootScope', '$templateCache', '$timeout',
      function ($compile, $document, $interval, $rootScope, $templateCache, $timeout) {

        var defaultScope = {
          message: '',
          buttons: []
        };

        var snackbarTimeout;

        var snackbarScope = $rootScope.$new();
        var snackbarTemplate = $compile($templateCache.get('snackbar-template.html'))(snackbarScope);
        snackbarScope.snackbar = defaultScope;
        $document.find('body').append(snackbarTemplate);

        return {
          show: function (options) {
            /**
             * options: {
             *  message: string
             *  duration = 2000
             *  buttons: [{
             *    text: string
             *    onClick: () => void
             *  }, ...]
             * }
             */
            if (!options.message) return;
            options.duration = options.duration || 2000;
            $timeout.cancel(snackbarTimeout);

            snackbarScope.snackbar = options;
            snackbarScope.show = true;
            snackbarTimeout = $timeout(function () {
              snackbarScope.show = false;
            }, options.duration);
          }
        };

      }
    ];
  });