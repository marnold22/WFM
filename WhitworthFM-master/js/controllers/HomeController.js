whitworthFM.controller('HomeController',
    function HomeController($scope, $timeout, $rootScope) {
        $scope.instaData = {};
        $scope.instaHeroImage = '';
        $scope.homeVolume = angular.copy($scope.volume);

        $timeout(function(){
            // Calling autoSize() from default.js
            autoSize();
            getInstagram();
            $scope.checkStatus();
        });

        var getDayString = function(day) {
            switch(parseInt(day)) {
                case 1:
                    return 'Monday';
                    break;
                case 2:
                    return 'Tuesday';
                    break;
                case 3:
                    return 'Wednesday';
                    break;
                case 4:
                    return 'Thursday';
                    break;
                case 5:
                    return 'Friday';
                    break;
                case 6:
                    return 'Saturday';
                    break;
                case 7:
                    return 'Sunday';
                    break;
                default:
                    return day;
            }
        }

        $scope.$on('tick', function() {
            $scope.getCurrentShow();
        });

        // Gets the current radio show playing based on the schedule
        $scope.getCurrentShow = function() {
            var javascriptDay =  new Date().getDay();
            var day =  javascriptDay === 0 ? 7 : javascriptDay;
            var dayString =  getDayString(day);
            var hour =  new Date().getHours();
            var minute =  new Date().getMinutes();

            if (minute >= 30) {
                hour += .5;
            }

            var dayArray =  _.sortBy($scope[dayString],function(element){
                return element.start;
            });

            dayArray.forEach(function(item) {
                if (hour >= item.start && hour < item.end) {
                    $scope.currentShow = item;

                    // If the next item in the array exists
                    var thisIndex = dayArray.indexOf(item);
                    var nextItem = dayArray[thisIndex + 1];
                    if (nextItem != undefined) {
                        $scope.nextShow = nextItem;
                    }
                    else {
                        day += 1;
                        if (day > 7) {
                            day = 1;
                        }
                        var nextArray = $scope[getDayString(day)];
                        if (nextArray.length > 0) {
                            $scope.nextShow = nextArray[0];
                        }
                    }
                }
            });

            if ($scope.currentShow != undefined) {
                if (hour > $scope.currentShow.end) {
                    $scope.currentShow = undefined;
                }
            }
            else {
                dayArray.forEach(function(item) {
                    // first item in array
                    if (dayArray.indexOf(item) === 0) {
                        if (hour < item.start) {
                            $scope.nextShow = item;
                        }
                    }
                    else {
                        var thisIndex = dayArray.indexOf(item);
                        var previousItem = dayArray[thisIndex - 1];
                        if (hour < item.start && hour > previousItem.end) {
                            $scope.nextShow = item;
                        }
                        else if (dayArray.indexOf(item) == (dayArray.length - 1)) {
                            day += 1;
                            if (day > 7) {
                                day = 1;
                            }
                            var nextArray = $scope[getDayString(day)];
                            if (nextArray.length > 0) {
                                $scope.nextShow = nextArray[0];
                            }
                        }
                    }


                });
            }
        }

        // When the volume changes on the home page
        // send a message to the shell controller
        $scope.$watch('homeVolume', function(val) {
            $rootScope.$broadcast('homeChangedVolume', {data: val});
        });

        // Toggles the volume from 0 to 100
        $scope.toggleMuteHome = function() {
            if ($scope.homeVolume > 0) {
                $scope.homeVolume = 0;
            }
            else {
                $scope.homeVolume = 100;
            }
        }

        /* ------------- INSTAGRAM API HELPER FUNCTIONS ------------- */
        var getInstagram = function() {
            $scope.addScript('https://api.instagram.com/v1/users/1479641855/media/recent?client_id=38f1efa460e44426b15b9343f8a58ca6&callback=instaCallback', 'instagram')
        }

        instaCallback = function(val) {
            if (val) {
               $scope.instaData = val.data[0];
               $scope.instaHeroImage = val.data[0].images.standard_resolution.url;
            }
        }

        /* ------------- end INSTAGRAM API HELPER FUNCTIONS ------------- */


        /* ------------- ANNOUNCEMENTS ------------- */
        $scope.myInterval = 5000;

        var getData = function () {

            var announcements = Parse.Object.extend('Announcement');
            var query = new Parse.Query(announcements);

            query.find({
                success:function(results) {
                    $timeout(function() {
                        $scope.slides = results;
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

        /* ------------- SCHEDULE ------------- */
        $scope.Monday = [];
        $scope.Tuesday = [];
        $scope.Wednesday = [];
        $scope.Thursday = [];
        $scope.Friday = [];
        $scope.Saturday = [];
        $scope.Sunday = [];


        var getScheduleData = function () {

            var Shows = Parse.Object.extend('Shows');
            var query = new Parse.Query(Shows);

            query.find({
                success:function(results) {
                    $timeout(function() {
                        prepareScheduleData(results);
                    });
                },
                error:function (error) {
                    $timeout(function() {
                        console.log(error);
                    });
                }
            });
        }
        getScheduleData();

        var prepareScheduleData = function(data) {
            data.forEach(function (item) {
                item.attributes.show_items.forEach(function (item2) {
                    switch (parseInt(item2.day)) {
                        case 1:
                            $scope.Monday.push({
                                id: item.id,
                                title: item.attributes.title,
                                hosts: item.attributes.host,
                                img_src: item.attributes.img_src,
                                description: item.attributes.description,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                        case 2:
                            $scope.Tuesday.push({
                                id: item.id,
                                title: item.attributes.title,
                                hosts: item.attributes.host,
                                img_src: item.attributes.img_src,
                                description: item.attributes.description,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                        case 3:
                            $scope.Wednesday.push({
                                id: item.id,
                                title: item.attributes.title,
                                hosts: item.attributes.host,
                                img_src: item.attributes.img_src,
                                description: item.attributes.description,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                        case 4:
                            $scope.Thursday.push({
                                id: item.id,
                                title: item.attributes.title,
                                hosts: item.attributes.host,
                                img_src: item.attributes.img_src,
                                description: item.attributes.description,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                        case 5:
                            $scope.Friday.push({
                                id: item.id,
                                title: item.attributes.title,
                                hosts: item.attributes.host,
                                img_src: item.attributes.img_src,
                                description: item.attributes.description,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                        case 6:
                            $scope.Saturday.push({
                                id: item.id,
                                title: item.attributes.title,
                                img_src: item.attributes.img_src,
                                description: item.attributes.description,
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
                                img_src: item.attributes.img_src,
                                description: item.attributes.description,
                                start: parseInt(item2.start),
                                end: item2.end
                            });
                            break;
                    }

                });
            });
        }


        // Schedule control helpers
        var currentDay = new Date().getDay();
        $scope.dayIndex =  currentDay === 0 ? 7 : currentDay;

        $scope.selectDay = function(index) {
            $scope.dayIndex = index;
            var string =  getDayString(index);
            $scope.currentShows = $scope[string];
        }

        $scope.selectDay($scope.dayIndex);

        $scope.subDay = function() {
            if ($scope.dayIndex == 1) {
               $scope.selectDay(7);
            }
            else {
                $scope.selectDay($scope.dayIndex - 1);
            }
        }

        $scope.addDay = function() {
            if ($scope.dayIndex == 7) {
                $scope.selectDay(1);
            }
            else {
                $scope.selectDay($scope.dayIndex + 1);
            }
        }

        // END schedule control helpers

    }
);
