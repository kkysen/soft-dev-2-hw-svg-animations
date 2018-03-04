"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const listener_1 = require("./listener");
const keys_1 = require("./keys");
exports.newExpandingBall = function (options) {
    const reset = function (game) {
        privateBall.radiusX = ball.initialRadius;
        privateBall.radiusY = ball.initialRadius;
        privateBall.radiusSpeed = ball.initialRadiusSpeed;
        privateBall.x = game.canvas.width / 2;
        privateBall.y = game.canvas.height / 2;
    };
    const reverseRadiusSpeed = function (direction) {
        privateBall.radiusSpeed = direction * Math.abs(ball.radiusSpeed);
        if (ball.onRadiusSpeedReversal) {
            ball.onRadiusSpeedReversal();
        }
    };
    const update = function (game) {
        let radiusX = ball.radiusX;
        let radiusY = ball.radiusY;
        radiusX += ball.radiusSpeed;
        radiusY += ball.radiusSpeed;
        if (radiusX < 0) {
            radiusX = 0;
            reverseRadiusSpeed(1);
        }
        else if (2 * radiusX > game.canvas.width) {
            reverseRadiusSpeed(-1);
        }
        if (radiusY < 0) {
            radiusY = 0;
            reverseRadiusSpeed(1);
        }
        else if (2 * radiusY > game.canvas.height) {
            reverseRadiusSpeed(-1);
        }
        privateBall.radiusX = radiusX;
        privateBall.radiusY = radiusY;
    };
    const ballRenderer = options.render;
    const delegateRender = function (game) {
        ballRenderer(game, ball);
    };
    const ownRender = function (game) {
        game.canvas.fillEllipse(ball.x, ball.y, ball.radiusX, ball.radiusY);
    };
    const render = options.render ? delegateRender : ownRender;
    const ball = {
        initialRadius: options.initialRadius,
        initialRadiusSpeed: options.initialRadiusSpeed,
        radiusX: 0,
        radiusY: 0,
        radiusSpeed: options.initialRadiusSpeed,
        x: 0,
        y: 0,
        reset: reset,
        update: update,
        render: render,
    };
    const privateBall = ball;
    return ball;
};
exports.newExpandingBallGame = function (options) {
    const parent = options.parent.appendNewElement("center");
    parent.appendNewElement("h4").innerText = "Use UP and DOWN arrow keys to change the speed of the radius.";
    const canvasDiv = parent.appendNewElement("div");
    parent.appendBr();
    const game = game_1.newGame()
        .name("Expanding Ball")
        .newCanvas(canvasDiv, options.canvas)
        .size(options.gameWidth, options.gameHeight)
        .build();
    parent.appendChild(game.start.button.withInnerText("I'm an Animaniac"));
    parent.appendChild(game.stop.button.withInnerText("STOP"));
    parent.appendChild(game.resume.button.withInnerText("Resume"));
    const reverseDirectionButton = parent.appendButton("Reverse Direction");
    parent.appendChild(game.reset.button.withInnerText("Reset"));
    const ball = exports.newExpandingBall({
        initialRadius: options.initialBallRadius,
        initialRadiusSpeed: options.initialBallRadiusSpeed,
        render: options.ballRenderer,
    });
    const updateReverseDirectionButtonText = function () {
        reverseDirectionButton.innerText =
            ball.radiusSpeed === 0
                ? "Reverse Direction"
                : ball.radiusSpeed < 0
                    ? "Grow" : "Shrink";
    };
    ball.onRadiusSpeedReversal = updateReverseDirectionButtonText;
    const privateBall = ball;
    game.addActor(ball);
    listener_1.newListener(() => {
        console.log("reversing");
        privateBall.radiusSpeed *= -1;
        updateReverseDirectionButtonText();
    }).click(reverseDirectionButton);
    updateReverseDirectionButtonText();
    // change speed
    window.addEventListener("keydown", function (e) {
        const deltaSpeed = keys_1.keyCodeToDeltaSpeed(e.keyCode);
        privateBall.radiusSpeed += Math.sign(ball.radiusSpeed) * deltaSpeed;
        if (ball.radiusSpeed === 0) {
            privateBall.radiusSpeed += deltaSpeed;
        }
        if (deltaSpeed !== 0) {
            e.preventDefault();
        }
    });
    game.ball = ball;
    return game;
};
