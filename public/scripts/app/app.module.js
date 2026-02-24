(function() {
    angular
        .module('app', [])
        .run(['$timeout', function($timeout) {
            // Remove dashboard loading state after Angular has bootstrapped and compiled.
            // This hides the progress bar and reveals the app, avoiding flash of uncompiled {{ }} templates.
            $timeout(function() {
                document.body.classList.remove('dashboard-loading');
            }, 0);
        }]);
})();