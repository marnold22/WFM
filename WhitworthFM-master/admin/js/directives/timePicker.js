admin.directive('timePicker', function ($timeout) {

    var link = function ($scope, attr, element) {
        // Initialize variables
        $scope.hour = 1;
        $scope.half = 0;
        $scope.ampm = 0;

        $scope.time = 1;

        $scope.$on('modalReset', function () {
            $timeout(function() {
                $scope.hour = 1;
                $scope.half = 0;
                $scope.ampm = 0;

                $scope.time = 1;
            });
        });

        $scope.$watchCollection('[hour, half, ampm]', function(vals, olds) {
            if (!vals && !olds) return;

            var hour
                ,half
                ,ampm;

            if (vals[0] != undefined && vals[1] != undefined  && vals[2] != undefined) {
                hour = angular.copy(parseInt(vals[0]));
                half = angular.copy(parseInt(vals[1]));
                ampm = angular.copy(parseInt(vals[2]));

                // Check AM and PM
                if (ampm) {
                    if (hour != 12) {
                        hour = hour + 12;
                    }
                }
                else {
                    if (hour == 12) {
                        hour = 0;
                    }
                }

                // Check half hour
                if (half) {
                    hour = hour + 0.5;
                }

                console.log(hour);
                $scope.time = hour;
            }

        });
    }


    return {
        restrict: 'E',
        templateUrl: '../admin/templates/directives/timePicker.html',
        link: link,
        scope: {
            time: '='
        }
    };
});

