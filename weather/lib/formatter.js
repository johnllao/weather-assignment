(function () {

    exports.formatDate = function (date) {
        var d = date;
        var months = [
            'Jan', 'Feb', 'Mar', 'Apr',
            'May', 'Jun', 'Jul', 'Aug',
            'Sep', 'Oct', 'Nov', 'Dec'];
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return days[d.getDay()] + ', ' + d.getDate() + '-' + months[d.getMonth()];
    };

})();