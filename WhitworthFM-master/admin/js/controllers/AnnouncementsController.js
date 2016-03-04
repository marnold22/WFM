admin.controller('AnnouncementsController',
    function AnnouncementsController($scope, $timeout, $rootScope) {
        $scope.Announcements = [];

        $scope.openModal = function (modal) {
            $rootScope.$broadcast('openModal', modal);
        }

        $scope.editAnnouncement = function(id) {
            $rootScope.$broadcast('openModal', 'announcementModal', {id: id});
        }

        $scope.$on('refreshAnnouncements', function(event) {
            $scope.Announcements = [];

            getData();
        });

        var getData = function () {

            var announcements = Parse.Object.extend('Announcement');
            var query = new Parse.Query(announcements);

            query.find({
                success:function(results) {
                    $timeout(function() {
                        console.log(results);
                        $scope.Announcements = results;
                    });
                },
                error:function (error) {
                    $timeout(function() {
                        console.log(error);
                    });
                }
            });
        }
        getData();

    }
);
