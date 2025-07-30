'use strict';

app.controller('LoginFormController', ['$scope', '$state', function($scope, $state) {
    $scope.user = {};
    $scope.authError = null;
    
    $scope.login = function() {
        $scope.authError = null;
        
        supabase.auth.signInWithPassword({
            email: $scope.user.email,
            password: $scope.user.password
        }).then(function(response) {
            if (response.error) {
                $scope.authError = response.error.message;
            } else {
                console.log('Login successful!', response.data);
                $state.go('app.dashboard');
            }
            $scope.$apply(); // Update the view
        });
    };
  }])
;