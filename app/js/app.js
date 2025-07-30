'use strict';

// --- SUPABASE INITIALIZATION ---
var SUPABASE_URL = 'https://czwefexjxhapgqeogofr.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d2VmZXhqeGhhcGdxZW9nb2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODQ1OTcsImV4cCI6MjA2OTM2MDU5N30.0tJP_8nlmiOMRbF1bgY-SJz0GT0z5THTHQwAvHQmBgY';

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// --- END OF SUPABASE INITIALIZATION ---


// Declare app level module
var app = angular.module('app', [
    'ngAnimate',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'ui.load',
    'ui.jq',
    'oc.lazyLoad',
    'perfect_scrollbar',
    'angular-inview',
    'angular-loading-bar'
]);

app.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        var baseTitle = 'Smartfill';
        var pageTitle = baseTitle + ' | Smartfill'; 

        if (toState.data && toState.data.pageTitle) {
            pageTitle = toState.data.pageTitle + ' | ' + baseTitle;
            if ($rootScope.app && $rootScope.app.settings) {
                $rootScope.app.settings.pagetitle = toState.data.pageTitle;
            }
        }
        document.title = pageTitle;
    });

    $rootScope.$on('$stateChangeStart', function(event, toState) {
        supabase.auth.getSession().then(function(response) {
            var session = response.data.session;
            var isAuthPage = toState.name.includes('access.');

            if (!session && !isAuthPage) {
                event.preventDefault(); 
                $state.go('access.login');
            }
        });
    });
}]);