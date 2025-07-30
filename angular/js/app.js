'use strict';

// --- SUPABASE INITIALIZATION ---
const SUPABASE_URL = 'https://czwefexjxhapgqeogofr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d2VmZXhqeGhhcGdxZW9nb2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODQ1OTcsImV4cCI6MjA2OTM2MDU5N30.0tJP_8nlmiOMRbF1bgY-SJz0GT0z5THTHQwAvHQmBgY'; // <-- Make sure your real key is here

// Create the Supabase client and make it globally available
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// --- END OF SUPABASE INITIALIZATION ---


// Declare app level module which depends on views, and components
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
    $rootScope.$on('$stateChangeStart', function(event, toState) {
        
        // This function runs before any page change
        supabase.auth.getSession().then(function(response) {
            const session = response.data.session;
            const isAuthPage = toState.name.includes('access.');

            // If the user is NOT logged in AND is trying to go to a page
            // that is NOT a login/register/etc. page...
            if (!session && !isAuthPage) {
                event.preventDefault(); // Stop them from going to the page
                $state.go('access.login'); // Redirect them to the login page
            }
        });
    });
}]);