$(document).ready(function() {
    $(window).on('resize', function(event) {
        autoSize();
    });
    autoSize();

    var audio1 = document.getElementById('audio1');

    if (audio1) {
        audio1.play();
    }

})

// Resizes all the containers to
// the full window width and height
// with the class auto-size
var autoSize = function() {
    var containers = $('.auto-size');
    containers.each(function(item) {
        $(this).height($(window).height());
    });
}

