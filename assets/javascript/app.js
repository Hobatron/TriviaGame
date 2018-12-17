var diff = [30,20,10] //TODO: Us jQuery to set css animate && timer****
var timerOn = true;

$(document).ready(function () {
    var countdownNumberEl = $('#countdown-number');
    var countdown = 45;
    countdownNumberEl.text(countdown);


    setInterval(function () {
        if (timerOn) {
            $("#countdown").toggle(true);
            $("svg circle").css("animation-play-state", "running");
            countdownNumberEl.text(countdown);
            countdown = --countdown <= 0 ? 45 : countdown;
        }
    }, 1000);

});
