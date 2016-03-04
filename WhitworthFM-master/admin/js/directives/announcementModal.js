admin.directive('announcementModal', function () {

    return {
        restrict: 'E',
        templateUrl: '../admin/templates/directives/announcementModal.html',
        controller: 'announcementModal',
        scope: {
        }
    };
});


admin.controller('announcementModal',
    function announcementModal($scope, $rootScope, $timeout) {
        var stateType = {NEW: 'Add', EDIT: 'Edit'};
        $scope.state = stateType.NEW;

        $scope.isLocked = false;
        $scope.saveAnnouncement = function(item) {
            if (!$scope.isLocked) {
                $scope.isLocked = true;
                if (validateAreaById('announcementModal')) {
                    switch ($scope.state) {
                        case stateType.NEW:

                            var Announcement = Parse.Object.extend('Announcement');
                            var announcement = new Announcement();

                            announcement.set('img_src', item.img_src);

                            announcement.save(null, {
                                success: function (announcement) {
                                    $timeout(function () {
                                        $rootScope.$broadcast('addToast', {type: 'success', message: 'Successfully Added your Announcement!'});
                                        $rootScope.$broadcast('closeModal', 'announcementModal');
                                        $rootScope.$broadcast('refreshAnnouncements');
                                        $scope.isLocked = false;
                                    });
                                },
                                error: function (announcement, error) {
                                    $timeout(function () {
                                        $rootScope.$broadcast('addToast', {type: 'danger', message: error});
                                        $scope.isLocked = false;
                                    });
                                }
                            })

                            break;
                        case stateType.EDIT:

                            var Announcement = Parse.Object.extend('Announcement');
                            var announcement = new Announcement();

                            announcement.id = item.id;
                            announcement.set('img_src', item.img_src);

                            announcement.save(null, {
                                success: function (announcement) {
                                    $timeout(function () {
                                        $rootScope.$broadcast('addToast', {type: 'success', message: 'Successfully Updated your Announcement!'});
                                        $rootScope.$broadcast('closeModal', 'announcementModal');
                                        $rootScope.$broadcast('refreshAnnouncements');
                                        $scope.isLocked = false;

                                    });
                                },
                                error: function (announcement, error) {
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
            $scope.announcement = { img_src: ''};
            if ($scope.announcementForm) {
                $scope.announcementForm.$setPristine();
            }
            $scope.state = stateType.NEW;
            $rootScope.$broadcast('modalReset');
        }

        $('#announcementModal').on('hide.bs.modal', function (e) {
            $scope.resetModal();
        });

        // Edit Modal
        $scope.$on('editannouncementModal', function(message, data) {
            $scope.state = stateType.EDIT;

            var Announcement = Parse.Object.extend("Announcement");
            var query = new Parse.Query(Announcement);

            query.get(data, {
                success: function(item) {
                    $timeout(function() {
                        $scope.announcement =  {
                            id: item.id,
                            img_src: item.attributes.img_src
                        };
                    });
                },
                error: function(object, error) {
                    $timeout(function() {
                        $rootScope.$broadcast('addToast', {type: 'danger', message: error});
                    });
                }
            });
        });

        $scope.deleteAnnouncement = function(announcement) {

            var Announcement = Parse.Object.extend('Announcement');
            var query = new Parse.Query(Announcement);

            query.get($scope.announcement.id, {
                success: function(item) {
                    // The object was retrieved successfully.
                    $timeout(function() {
                        item.destroy({});
                        $rootScope.$broadcast('addToast', {type: 'danger', message:'Successfully Deleted your Announcement!'});
                        $rootScope.$broadcast('closeModal', 'announcementModal');
                        $rootScope.$broadcast('refreshAnnouncements');
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
