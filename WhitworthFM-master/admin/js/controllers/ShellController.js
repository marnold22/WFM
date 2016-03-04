admin.controller('ShellController',
    function ShellController($scope, $route, $location, $timeout) {

        $scope.$on('$locationChangeSuccess', function(val) {
            var string = $location.path().split('/');

            if (string[2]) {
                $scope.viewPage(string[2]);
            }
        });

        $scope.checkPage = function(page) {
            return page === $scope.thisPage;
        }

        $scope.viewPage = function(page) {
            $scope.thisPage = page;
        }

        // Toast stuff
        $scope.toasts = [];

        // Type = success, info, warning, danger
        $scope.$on('addToast', function(event, data) {
              addToast(data);
        });

        var addToast = function(data) {
            console.log(data);
            var obj = {type: data.type, message: data.message};
            $scope.toasts.push(obj);

            $timeout(function() {
                $scope.toasts.splice($scope.toasts.indexOf(obj),1);
            },5000);
        }

        // MODAL HANDLERS

        $scope.$on('openModal', function (message, data, edit) {
            if ($('#' + data)) {
                $('#' + data).modal({
                    show: true,
                    backdrop: 'static'
                });

                if (edit) {
                    // Send message that the modal is being edited
                    $scope.$broadcast('edit' + data, edit.id);
                }
            }
        });

        $scope.$on('closeModal', function (message, data) {
            if ($('#' + data)) {
                $('#' + data).modal('hide');
            }
        });

    }
);
