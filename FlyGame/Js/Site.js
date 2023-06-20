var currentMousepos = { x: -1, y: -1 };

var gameStatus = {
    score: 0,
    hitCount: 0,
    shakeLevelNumber: 200,
    speed: 40,
    addTargetCount: 1,
    totalTargets: 0,
    shootCount: 0
};

$(document).ready(function () {

    $("#level-select").on("change", function () {
        let number = Number.parseInt($(this).val());
        gameStatus.shakeLevelNumber = number;
    });
    $("#speed-select").on("change", function () {
        let number = Number.parseInt($(this).val());
        gameStatus.speed = number;
    });
    $("#count-select").on("change", function () {
        let number = Number.parseInt($(this).val());
        gameStatus.addTargetCount = number;
    });

    $(document).on("mousemove", function (event) {
        currentMousepos.x = event.pageX;
        currentMousepos.y = event.pageY;

        $("#shoot-cursor").css("top", event.pageY - 25);
        $("#shoot-cursor").css("left", event.pageX - 25);
    });
        addTarget();


    $("body").keyup(function (e) {
        if (e.keyCode === 32) {
            playSound("files/sound.mp3", 2000);
            gameStatus.shootCount = gameStatus.shootCount + 1;

            $(".target").each(function () {
                targetHitChecker(this);
            });

            updateGameInfo();
        }
    });
});
    

    function targetHtml(id) {
        var html = '';

        html += '<div class="target" hit="0" id="' + id + '">';
        html += '<img src="files/fly.png" />';
        html += '</div>';

        return html;

    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function updateGameInfo() {
        $("#total-target-span").text(gameStatus.totalTargets);
        $("#score-span").text(gameStatus.score);
        $("#hit-count-span").text(gameStatus.hitCount);
        $("#shoot-count-span").text(gameStatus.shootCount);
    }

    function playSound(file, duration) {
        let audioElement = document.createElement("audio");
        audioElement.setAttribute("src", file);
        audioElement.play();
        setTimeout(function () {
            audioElement.pause();
        }, duration);
    }

    function addTarget() {
        var min = (gameStatus.addTargetCount * 100) + 500;
        var max = (gameStatus.addTargetCount * 300) + 2000;


        var randomDuration = randomInt(min, max);
        var randomId = randomInt(400000, 90000000);
        var targetHtmlStr = targetHtml(randomId);
        $(".game-area").append(targetHtmlStr);
        var _target = $("#" + randomId);
        gameStatus.totalTargets = gameStatus.totalTargets + 1;
        updateGameInfo();
        var randomPos = { x: randomInt(100, window.innerWidth - 100), y: randomInt(100, window.innerHeight) };
        _target.css("top", randomPos.y);
        _target.css("left", randomPos.x);


        var randomDeg = randomInt(0, 360);
        _target.css("transform", "rotate(" + randomDeg + "deg)"); 

        moveTarget(_target);

        setTimeout(function () {
            addTarget()
        }, randomDuration);

        playSound("files/fly-sound.wav", 1000);

    }

    function moveTarget(target) {
        setTimeout(function () {
            var offset = target.offset();
            if (offset === undefined)
                return;

            if (offset.left > window.innerWidth || offset.left < 1 || offset.top > window.innerHeight || offset.top < 1) {
                target.remove();
                return;
            }

            target.css("top", offset.top - (randomInt(-gameStatus.shakeLevelNumber, gameStatus.shakeLevelNumber)));
            target.css("left", offset.left - (randomInt(-gameStatus.shakeLevelNumber, gameStatus.shakeLevelNumber)));

            moveTarget(target);

        }, gameStatus.speed);
    }

    function targetHitChecker(target) {
        var offset = $(target).offset();
        if (offset === undefined)
            return;

        var width = $(target).width();
        var height = $(target).height();

        var checkYPos = currentMousepos.y > offset.top && currentMousepos.y < (offset.top + height);
        var checkXPos = currentMousepos.x > offset.left && currentMousepos.x < (offset.left + width);

        if (checkYPos && checkXPos) {
            var hitAttr = $(target).attr("hit");
            var hitNumber = Number.parseInt(hitAttr);
            if (hitNumber > 1) {
                $(target).css("transform", "rotate(360deg) scale(0.01)");
                setTimeout(function () { $(target).remove(); }, 200);
                gameStatus.score = gameStatus.score + 1;
                updateGameInfo();
                return;

            }

            $(target).attr("hit", hitNumber + 1);
            updateGameInfo();
            if (hitNumber === 0) {
                $(target).css("border", "1px solid #71cd2b");
                return;

            }

            if (hitNumber === 1) {
                $(target).css("border", "1px solid #f71f1f");
                return;
            }



        }
    }