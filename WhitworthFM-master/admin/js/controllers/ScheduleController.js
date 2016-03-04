admin.controller('ScheduleController',
    function ScheduleController($scope, $timeout, $rootScope) {
        $scope.Monday = [];
        $scope.Tuesday = [];
        $scope.Wednesday = [];
        $scope.Thursday = [];
        $scope.Friday = [];
        $scope.Saturday = [];
        $scope.Sunday = [];

        $scope.openModal = function (modal) {
            $rootScope.$broadcast('openModal', modal);
        }

        $scope.editShow = function(id) {
            $rootScope.$broadcast('openModal', 'scheduleModal', {id: id});
        }

        $scope.$on('refreshSchedule', function(event) {
            $scope.Monday = [];
            $scope.Tuesday = [];
            $scope.Wednesday = [];
            $scope.Thursday = [];
            $scope.Friday = [];
            $scope.Saturday = [];
            $scope.Sunday = [];

            getData();
        });

        var getData = function () {

            var Shows = Parse.Object.extend('Shows');
            var query = new Parse.Query(Shows);

            query.find({
                success:function(results) {
                    $timeout(function() {
                        console.log(results);
                        prepareData(results);
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

        var prepareData = function(data) {
            data.forEach( function(item) {
                item.attributes.show_items.forEach(function(item2) {
                    // TODO: Update only the changed show if the item already exists in the array
                    switch (parseInt(item2.day)){
                        case 1:
                            $scope.Monday.push({
                                id: item.id,
                                title: item.attributes.title,
                                hosts: item.attributes.host,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                        case 2:
                            $scope.Tuesday.push({
                                id: item.id,
                                title: item.attributes.title,
                                hosts: item.attributes.host,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                        case 3:
                            $scope.Wednesday.push({
                                id: item.id,
                                title: item.attributes.title,
                                hosts: item.attributes.host,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                        case 4:
                            $scope.Thursday.push({
                                id: item.id,
                                title: item.attributes.title,
                                hosts: item.attributes.host,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                        case 5:
                            $scope.Friday.push({
                                id: item.id,
                                title: item.attributes.title,
                                hosts: item.attributes.host,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                        case 6:
                            $scope.Saturday.push({
                                id: item.id,
                                title: item.attributes.title,
                                hosts: item.attributes.host,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                        case 7:
                            $scope.Sunday.push({
                                id: item.id,
                                title: item.attributes.title,
                                hosts: item.attributes.host,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                    }

                });
            });

        }

    }
);
