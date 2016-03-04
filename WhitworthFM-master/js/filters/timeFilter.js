// Returns string value of day of the week based on numeric value 1 - 7
whitworthFM.filter('timeFilter', function () {
    return function(input){
        if(input === undefined) return '';

        var output = '';
        var ampm = 'am';
        var hour = parseInt(input);


        if (hour > 11.5) {
            ampm = "pm";
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