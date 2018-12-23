var timerOn = false;
var waiting = false;
var catagory = {
    "music": 12,
    "boardGames": 16,
    "math": 19,
    "film": 11,
    "videoGames": 15,
    "mythos": 20
};
var difficulty;
var question = {};
var qNum = 0;
var currentAns = "";
var correctAns = "";
var score = 0;
var wrong = 10;
var gameOver = false;

$(document).ready(function () {

    $(".radio").click(function () {
        currentCat = catagory[this.id];
    });

    $(".diff").click(function () {
        difficulty = this.id;
    });

    $("#start").click(function () {
        var queryURL =
            "https://opentdb.com/api.php?amount=10&category=" + currentCat
            + "&difficulty=" + difficulty + "";
        
        $.getJSON(queryURL, function () {})
        .done(function (results) {
            if (results.response_code != 1) {
                question = results;
                $("#questionBox").fadeIn(200);
                newQ();
                $("#gameSetup").toggle();
            } else {
                alert("error code: 1; not enough questions in cat&diff; please try another.");
            };
        })
        .fail(function () {
            alert("Connection to opentdb failed check console for link");
            console.log(queryURL);
        });


    });


    var countdownNumberEl = $("#countdown-number");
    var countdown = 45;
    countdownNumberEl.text(countdown);

    setInterval(function () {
        if (timerOn) {
            $("svg circle").css("animation-play-state", "running");
            countdown--;
            countdownNumberEl.text(countdown);
            if (countdown == 0) {
                timerOn = false;
                $("svg circle").css("display", "none");
                gameOver();
            }
        }
    }, 1000);

    $("#submit").click(function () {
        if (gameOver == true) {
            test();
        }
        if (waiting == true) {
            currentAns = "";
            waiting = false;
            $(this).text("submit");
            for (var i = 0; i < question.results[(qNum - 1)].incorrect_answers.length + 1; i++) {
                $("#" + i).css("background-color", "rgb(223, 223, 223)");
            };
            if ($("#2").is(":hidden")) {
                $("#2").toggle();
                $("#3").toggle();
            }
            if (qNum != 10) {
                newQ();
            } else {
                gameOver();
            }
        }
        if (currentAns && !waiting) {
            if (currentAns == correctAns) {
                score++;
                wrong--;
            }
            currentAns = "";
            $(this).text("Next");
            $("svg circle").css("animation-play-state", "paused");
            timerOn = false;
            for (var i = 0; i < question.results[(qNum - 1)].incorrect_answers.length + 1; i++) {
                $("#" + i).css("background-color", "rgb(255, 30, 30)");
            };
            $("#" + correctAns).css("background-color", "rgb(30, 255, 30)");
            waiting = true;
        }

    });

    $(".ans").on("click", function () {
        if (!waiting) {
            if (currentAns) {
                $("#" + currentAns).css("background-color", "rgb(223, 223, 223)");
            }
            currentAns = this.id;
            $("#" + currentAns).css("background-color", "rgb(173, 173, 173)");
        }

    });

    function jDecode(str) {
        return $("<div/>").html(str).text();
    };

    function newQ() {
        timerOn = true;
        var currentQ = question.results[qNum]
        $("#question").html(jDecode(currentQ.question));
        if (currentQ.incorrect_answers.length < 2) {
            $("#2").toggle();
            $("#3").toggle();
        };


        correctAns = Math.floor(Math.random() * currentQ.incorrect_answers.length)

        $("#" + correctAns).text(jDecode(currentQ.correct_answer));
        var skip = 0
        $.each(currentQ.incorrect_answers, function (index, value) {
            if (index != correctAns) {
                $("#" + (index + skip)).text(jDecode(value));

            } else {
                skip = 1;
                $("#" + (index + skip)).text(jDecode(value));
            };
        });

        qNum++;
        $("#qNum").text("Question " + qNum + ":");
    }

    function gameOver () {
        timerOn = false;
        for (var i = 0; i < 4 ; i++) {
            $("#"+i).css("display","none");
        }
        var finalScore = (score - wrong) + (countdown * .2);
        $("#qNum").text("Final Score: "+finalScore + " points");
        $("#question").text("score breakdown: " + countdown + "s left (.2pnt per), you got " + score + " right and " + wrong + " wrong");
        gameOver = true
        if (finalScore > 0) {
            $("#question").prepend("<div style='color : green'>Congrats on going positive!</div>");
        }
        $("#submit").text("Retry");

    }
    function test() {
        location.reload();
    }
});