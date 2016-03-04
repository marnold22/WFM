admin.controller('LoginController',
    function LoginController($scope, $timeout, $rootScope, $location) {

        // Initializes bootstrap login modal
        $timeout(function() {
            $('#myModal').on('shown.bs.modal', function () {
                $('#myModal input').first().focus()
            })

            $('#myModal').modal({
                show: true,
                backdrop: 'static'
            });
         });


        $scope.login = function(user){
            if ($scope.loginForm.$valid) {
                Parse.User.logIn(user.username, user.pass, {
                    success: function(user) {
                        // Do stuff after successful login.
                        $timeout(function() {
                            $rootScope.$broadcast('addToast', {type: 'success', message: 'Logged in!'});
                            $location.path('/wfm-admin/schedule');
                        });
                    },
                    error: function(user, error) {
                        // Do stuff after successful login.
                        $timeout(function() {
                            $rootScope.$broadcast('addToast', {type: 'danger', message: 'Logged unsuccessful: ' + error});
                        });
                    }
                });
            }
            else {
                $rootScope.$broadcast('addToast', {type: 'danger', message: 'Please fill out the form correctly!'});
            }
        }

    }
);
