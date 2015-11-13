$(document).ready(function () {
    var state = 0;

    $('.content').click(function(event) {
        var val = $(this).text();

        if (val !== '') {
            return;
        }

        if (state) {
            $(this).text('X');
            state = 0;
        } else {
            $(this).text('O');
            state = 1;
        }
    });
});