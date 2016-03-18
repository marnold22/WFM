/*
* The Shell Controller sits at the top of body html and handles the audio functions
* and other various
*/
whitworthFM.controller('ShellController',
    function ShellController($scope, $timeout, $interval, $http, $location, $window) {

        // INITIALIZES SHOUTCAST STREAMER
        var initShoutcast = function() {
            // Timeout function ensures that the shoutcast loads after the controller has finished loading
            $timeout(function() {
                $.SHOUTcast({
                    host: 'majestic.wavestreamer.com',
                    port: 7985,
                    stream: 1,
                    interval: 1000,
                    stats: function () {
                        // TODO: Remove for production
                        console.log('Status:' + this.get('status'));
                        console.log('Status Code: ' + this.get('streamstatus'));
                        console.log('Next:' + this.get('nexttitle'));

                        var status = this.get('streamstatus');
                        if (status) {
                            $scope.checkStatus(this.get('songtitle'));
                        }
                        else {
                            $scope.checkStatus('Streaming Unavailable');
                        }

                        $scope.$broadcast('tick');
                    }
                }).startStats();
            });
        }
        initShoutcast();

        // Detects the user agent of the device and sets a flag whether the device is mobile
        var __isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (__isMobile.Android() || __isMobile.BlackBerry() || __isMobile.iOS() || __isMobile.Opera() || __isMobile.Windows());
            }
        };

        // Boolean defaults
        $scope.isMobile = __isMobile.any();
        $scope.isItunes = false;
        $scope.streamLoaded = false;
        $scope.smallHeader = false;
        $scope.currentPage = 'home';
        $scope.currentSong = {};
        $scope.songString = '';
        $scope.volume = 75;


        // Watch event is fired when the url changes and sets the path to a variable
        $scope.$on('$locationChangeSuccess', function() {
            $scope.currentPage = $location.path();
        });

        // Handles the volume of the audio player
        $scope.$watch('volume', function(val) {
            $("#audio1").prop("volume", val * .01);
        });

        // Message received from the home controller when that page changes the volume
        $scope.$on('homeChangedVolume', function(e, data) {
            $scope.volume = data.data;
        });

        // Checks the status of the shoutcast streamer and changes the title
        $scope.checkStatus = function(title) {
            if (title === 'Streaming Unavailable') {
                $scope.currentSong.title = title;
            }
                //doesnt work because this service requires an additional fee that radio isn't currently paying
            if (!title || title == 'N/A') {
                $scope.currentSong.title = 'Live Show';
                return;
            }

            if (title&& (title != $scope.songString)) {
                $scope.songString = title;
                $scope.getSongDetails($scope.songString);
            }

        }


        /* ------------- SPOTIFY ALBUM ART ------------- */
        var splitString;
        var getSongSpotify = function(val) {
            splitString = val.split('-');
            var cleanVal = val.replace('#', '');

            $http({method: 'GET', url: 'https://api.spotify.com/v1/search?q=' + encodeURI(cleanVal) + '&type=track' }).
                success(function(data, status, headers, config) {
                    if (data.tracks.items[0]) {
                        $scope.currentSong = data.tracks.items[0];
                    }

                    if (splitString[1]) {
                        $scope.currentSong.title = splitString[1].replace(/&amp;/g, '&');
                    }

                    if (splitString[0]) {
                        $scope.currentSong.artist = splitString[0].replace(/&amp;/g, '&');
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log(data);
                });
        }

        /* ------------- end SPOTIFY ALBUM ART ------------- */

        /* ------------- ITUNES ALBUM ART ------------- */
        var getSongItunes = function(val){
            splitString = val.split('-');
            var cleanVal = val.replace('#', '');
            $scope.addScript('https://itunes.apple.com/search?term=' + encodeURI(cleanVal) + '&callback=itunesCallback', 'itunes')
        }

        // This function dynamically adds scripts to the html body
        // which is required when using the iTunes API
        $scope.addScript = function(src, id) {
            if ($('#' + id)) {
                $('#' + id).remove();
            }
            var head = document.getElementsByTagName('head')[0];
            var script= document.createElement('script');
            script.id = id;
            script.type= 'text/javascript';
            script.src= src;
            head.appendChild(script);
        }

        itunesCallback = function(data) {
            $scope.currentSong.album = {images: [{url:''},{url:''}]};
            $scope.isItunes = false;
            if (data.resultCount > 0) {
                $scope.isItunes = true;
                $scope.currentSong.album.url = data.results[0].collectionViewUrl;
                $scope.currentSong.album.name = data.results[0].collectionName;
                $scope.currentSong.album.images[1].url = data.results[0].artworkUrl100.replace('100x100-75', '600x600-75');
            }
            if (splitString[1]) {
                $scope.currentSong.title = splitString[1].replace(/&amp;/g, '&');
                if (splitString[0]) {
                    $scope.currentSong.artist = splitString[0].replace(/&amp;/g, '&');
                }
            }
            else {
                $scope.currentSong.artist = data.artistName;
                if (splitString[0]) {
                    $scope.currentSong.title = splitString[0].replace(/&amp;/g, '&');
                }
            }
            $scope.streamLoaded = true;

        }
        /* ------------- end ITUNES ALBUM ART ------------- */

        // Calls the appropriate API methods to get and set the album art
        // If you want to switch the API, then use this function
        $scope.getSongDetails = function(val) {
            getSongItunes(val);
        }

        // Toggles the volume from 0 to 100
        $scope.toggleMute = function() {
            if ($scope.volume > 0) {
                $scope.volume = 0;
            }
            else {
                $scope.volume = 100;
            }
        }

        // This function smoothly scrolls to the id that is passed into the function
        $scope.scrollToId = function(id) {
            if (!id) {
                $(document.body).animate({
                    'scrollTop':   0,
                    'easing': 'easeInOutQuad'
                }, 400);
                return;
            }
            $(document.body).animate({
                'scrollTop':   $('#' + id).offset().top,
                'easing': 'easeInOutQuad'
            }, 400);
        }


        $timeout(function() {

            // Bind to the scroll event
            // if the scroll pos is greater than 15% of
            // the window height, then show the small header
            // else, hide it
            angular.element($window).bind("scroll", function(e) {
                if ((e.currentTarget.innerHeight *.15) < e.currentTarget.scrollY) {
                    $scope.smallHeader = true;
                }
                else {
                    $scope.smallHeader = false;
                }
            });
        });

    }
);
