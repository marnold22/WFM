// Returns string value of day of the week based on numeric value 1 - 7
admin.filter('dayFilter', function () {
    return function(input){
        if(!input === undefined) return '';

        var data = parseInt(input);

        switch(data) {
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
                return data;
        }
    }
});