admin.directive('scheduleModal', function () {

    return {
        restrict: 'E',
        templateUrl: '../admin/templates/directives/scheduleModal.html',
        controller: 'scheduleModal',
        scope: {
        }
    };
});


admin.controller('scheduleModal',
    function scheduleModal($scope, $rootScope, $timeout) {
        var stateType = {NEW: 'Add', EDIT: 'Edit'};
        $scope.state = stateType.NEW;

        $scope.show = { img_src: '', show_items: [] };
        $scope.temp = { day: 1 };

        $scope.addShowTime = function(item) {
            $scope.show.show_items.push(angular.copy(item));
        }

        $scope.removeShowTime = function(index) {
            $scope.show.show_items.splice(index, 1);
        }

        $scope.isLocked = false;
        $scope.saveShow = function(item) {
            if (!$scope.isLocked) {
                $scope.isLocked = true;
                if (validateAreaById('scheduleModal') && $scope.show.show_items.length > 0) {
                    switch ($scope.state) {
                        case stateType.NEW:

                            var Shows = Parse.Object.extend('Shows');
                            var shows = new Shows();

                            shows.set('title', $scope.show.title);
                            shows.set('host', $scope.show.host);
                            shows.set('description', $scope.show.description);
                            shows.set('img_src', $scope.show.img_src);
                            shows.set('show_items', $scope.show.show_items);

                            shows.save(null, {
                                success: function (shows) {
                                    $timeout(function () {
                                        $rootScope.$broadcast('addToast', {type: 'success', message: 'Successfully Added ' + item.title + '!'});
                                        $rootScope.$broadcast('closeModal', 'scheduleModal');
                                        $rootScope.$broadcast('refreshSchedule');
                                        $scope.isLocked = false;
                                    });
                                },
                                error: function (shows, error) {
                                    $timeout(function () {
                                        $rootScope.$broadcast('addToast', {type: 'danger', message: error});
                                        $scope.isLocked = false;
                                    });
                                }
                            })

                            break;
                        case stateType.EDIT:

                            var Shows = Parse.Object.extend('Shows');
                            var shows = new Shows();

                            shows.id = $scope.show.id;
                            shows.set('title', $scope.show.title);
                            shows.set('host', $scope.show.host);
                            shows.set('description', $scope.show.description);
                            shows.set('img_src', $scope.show.img_src);
                            shows.set('show_items', $scope.show.show_items);

                            shows.save(null, {
                                success: function (shows) {
                                    $timeout(function () {
                                        $rootScope.$broadcast('addToast', {type: 'success', message: 'Successfully Updated ' + item.title + '!'});
                                        $rootScope.$broadcast('closeModal', 'scheduleModal');
                                        $rootScope.$broadcast('refreshSchedule');
                                        $scope.isLocked = false;

                                    });
                                },
                                error: function (shows, error) {
                                    $timeout(function () {
                                        $rootScope.$broadcast('addToast', {type: 'danger', message: error});
                                        $scope.isLocked = false;
                                    });
                                }
                            });
                            break;
                    }
                }
                else {
                    $rootScope.$broadcast('addToast', {type: 'danger', message: 'Please fill out the form correctly!'});
                    $scope.isLocked = false;
                }
            }
        }

        $scope.resetModal = function() {
            $scope.show = { img_src: '', show_items: [] };
            $scope.temp = { day: 1, start: 1, end: 1 };
            if ($scope.scheduleForm) {
                $scope.scheduleForm.$setPristine();
            }

            $scope.state = stateType.NEW;
            $rootScope.$broadcast('modalReset');
        }

        $('#scheduleModal').on('hide.bs.modal', function (e) {
            $scope.resetModal();
        });

        // Edit Modal
        $scope.$on('editscheduleModal', function(message, data) {
            $scope.state = stateType.EDIT;

            var Shows = Parse.Object.extend("Shows");
            var query = new Parse.Query(Shows);

            query.get(data, {
                success: function(item) {
                    $timeout(function() {
                        $scope.show = {
                            id: item.id,
                            title: item.attributes.title,
                            host: item.attributes.host,
                            description: item.attributes.description,
                            img_src: item.attributes.img_src,
                            show_items: item.attributes.show_items
                        };
                    });
                },
                error: function(object, error) {
                    $timeout(function() {
                        $rootScope.$broadcast('addToast', {type: 'danger', message: error});
                    });
                }
            });
        })

        $scope.deleteShow = function(show) {

            var Shows = Parse.Object.extend('Shows');
            var query = new Parse.Query(Shows);

            query.get(show.id, {
                success: function(item) {
                    // The object was retrieved successfully.
                    $timeout(function() {
                        item.destroy({});
                        $rootScope.$broadcast('addToast', {type: 'danger', message:'Successfully Deleted ' + show.title + '!'});
                        $rootScope.$broadcast('closeModal', 'scheduleModal');
                        $rootScope.$broadcast('refreshSchedule');
                    });

                },
                error: function(object, error) {
                    $timeout(function() {
                        $rootScope.$broadcast('addToast', {type: 'danger', message: error});
                    });
                }
            });


        }


        var validateAreaById = function (modal) {
            //find all the required fields
            var isValid = true;
            _.each($('#' + modal + ' input'), function (field) {
                if ($(field).is('[required]')) {
                    //set it to dirty
                    $(field).addClass('ng-dirty');
                    //is there a value? set to ng-valid
                    if (!field.value) {
                        isValid = false;
                        $(field).addClass('ng-invalid');
                        $(field).addClass('ng-invalid-required');
                    }
                    else {
                        $(field).addClass('ng-valid');
                        $(field).addClass('ng-valid-required');
                    }

                }
            })

            return isValid;
        }
    }
);
