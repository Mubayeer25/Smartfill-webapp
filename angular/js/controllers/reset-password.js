'use strict';

app.controller('ResetPasswordController', ['$scope', function($scope) {
    $scope.user = {};
    $scope.authError = null;
    $scope.successMessage = null;

    $scope.updatePassword = function() {
        $scope.authError = null;
        $scope.successMessage = null;

        supabase.auth.updateUser({
            password: $scope.user.password
        }).then(function(response) {
            if (response.error) {
                $scope.authError = response.error.message;
            } else {
                $scope.successMessage = 'Password updated successfully!';
            }
            $scope.$apply();
        });
    };
}]);