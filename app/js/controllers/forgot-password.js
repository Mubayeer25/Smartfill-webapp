'use strict';

app.controller('ForgotPasswordController', ['$scope', function($scope) {
    $scope.user = {};
    $scope.authError = null;
    $scope.successMessage = null;

    $scope.resetPassword = function() {
        $scope.authError = null;
        $scope.successMessage = null;

        // This is the URL the user will be sent to from the email link.
        const resetUrl = 'http://localhost:8080/app/#/access/forgotpwd';

        supabase.auth.resetPasswordForEmail($scope.user.email, {
            redirectTo: resetUrl,
        }).then(function(response) {
            if (response.error) {
                $scope.authError = response.error.message;
            } else {
                $scope.successMessage = 'Password reset link sent! Please check your email.';
            }
            $scope.$apply(); // Update the view with the message
        });
    };
}]);