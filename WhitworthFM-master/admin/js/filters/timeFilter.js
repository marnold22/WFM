// Returns string value of day of the week based on numeric value 1 - 7
admin.filter('timeFilter', function () {
    return function(input){
        if(input === undefined) return '';

        var output = '';
        var ampm = 'AM';
        var hour = parseInt(input);


        if (hour > 11.5) {
            ampm = "PM";
            hour -= 12;
        }

        if (hour === 0) {
            hour = 12;
        }

        var str = input.toString();
        if (str.indexOf('.') > -1) {
            output = hour + ':30';
        }
        else {
            output = hour;
        }

        output += ampm;

        return output;

    }
});