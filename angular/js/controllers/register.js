'use strict';

app.controller('RegisterFormController', ['$scope', function($scope) {
    $scope.user = {};
    $scope.authError = null;

    $scope.register = function() {
        $scope.authError = null;

        supabase.auth.signUp({
            email: $scope.user.email,
            password: $scope.user.password
        }).then(function(response) {
            if (response.error) {
                $scope.authError = response.error.message;
            } else {
                alert('Registration successful! Check your email to confirm your account.');
                console.log('Success:', response.data);
            }
            $scope.$apply(); // Update the view
        });
    };
  }])
 ;