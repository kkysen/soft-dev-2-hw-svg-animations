"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const utils_1 = require("./utils");
const keys_1 = require("./keys");
exports.newBouncingBall = function (options) {
    if (!options.minBounceInterval) {
        options.minBounceInterval = 2; // default
    }
    const setNumBouncesText = function (numBounces = ball.numBounces) {
        ball.numBouncesText.innerText = "Number of Bounces: " + numBounces;
    };
    const setAngleText = function (angle = ball.angle) {
        ball.angleText.innerText = "Angle: " + utils_1.MathUtils.angleToString(angle);
    };
    const setSpeedText = function (speed = ball.speed) {
        ball.speedText.innerText = "Speed: " + speed;
    };
    const reset = function (game) {
        privateBall.initialSpeed = options.initialSpeed();
        privateBall.initialAngle = options.initialAngle();
        privateBall.x = game.canvas.width / 2;
        privateBall.y = game.canvas.height / 2;
        privateBall.speed = privateBall.initialSpeed;
        privateBall.angle = privateBall.initialAngle;
        privateBall.lastXBounceTick = 0;
        privateBall.lastYBounceTick = 0;
        privateBall.numBounces = 0;
        setAngleText();
        setSpeedText();
        setNumBouncesText();
        console.log("Initial Angle: " + utils_1.MathUtils.angleToString(ball.initialAngle));
    };
    const update = function (game) {
        const canvas = game.canvas;
        const radiusX = ball.radiusX;
        const radiusY = ball.radiusY;
        let x = ball.x;
        let y = ball.y;
        let angle = ball.angle;
        const xBounce = x < radiusX || x > canvas.width - radiusX;
        const yBounce = y < radiusY || y > canvas.height - radiusY;
        if (game.tick - ball.lastXBounceTick > ball.minBounceInterval && xBounce) {
            angle = -(Math.PI + angle) % utils_1.MathUtils.TAU;
            privateBall.lastXBounceTick = game.tick;
        }
        else if (game.tick - ball.lastYBounceTick > ball.minBounceInterval && yBounce) {
            angle = -angle;
            privateBall.lastYBounceTick = game.tick;
        }
        if (xBounce || yBounce) {
            privateBall.numBounces++;
            setNumBouncesText();
            setAngleText(angle);
        }
        // fail safe to rescue balls off screen
        if (game.tick % 16 === 0) {
            if (x < 0) {
                x = radiusX;
            }
            if (x > canvas.width) {
                x = canvas.width - radiusX;
            }
            if (y < 0) {
                y = radiusY;
            }
            if (y > canvas.height) {
                y = canvas.height - radiusY;
            }
        }
        // super fail safe, reset to center
        // usually happens at extreme speeds, so not noticeable really
        if (game.tick % 64 === 0) {
            if (x < 0 || x > canvas.width) {
                console.log("super fail safe");
                x = canvas.width / 2;
            }
            if (y < 0 || y > canvas.height) {
                console.log("super fail safe");
                y = canvas.height / 2;
            }
        }
        const speed = ball.speed;
        const delta = 1; // this.delta * 0.01;
        x += speed * Math.cos(angle) * delta;
        y += speed * Math.sin(angle) * delta;
        privateBall.angle = angle;
        privateBall.x = x;
        privateBall.y = y;
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
        numBouncesText: options.numBouncesText,
        speedText: options.speedText,
        angleText: options.angleText,
        setNumBouncesText: setNumBouncesText,
        setSpeedText: setSpeedText,
        setAngleText: setAngleText,
        minBounceInterval: options.minBounceInterval,
        radiusX: options.radiusX(),
        radiusY: options.radiusY(),
        // are set in reset()
        initialSpeed: 0,
        initialAngle: 0,
        x: 0,
        y: 0,
        speed: 0,
        angle: 0,
        lastXBounceTick: 0,
        lastYBounceTick: 0,
        numBounces: 0,
        update: update,
        render: render,
        reset: reset,
    };
    const privateBall = ball;
    return ball;
};
exports.newBouncingBallGame = function (options) {
    const numBalls = options.numBalls === undefined ? 1 : options.numBalls;
    if (numBalls < 0) {
        throw new Error("options.numBalls must be non-negative");
    }
    const parent = options.parent.appendNewElement("center");
    parent.appendNewElement("h4").innerText = "Use UP and DOWN arrow keys to change the velocity.";
    parent.appendNewElement("h4").innerText = "Use LEFT and RIGHT arrow keys to change the angle.";
    const textElements = {
        numBounces: utils_1.nullTextElement,
        angleText: utils_1.nullTextElement,
        speedText: utils_1.nullTextElement,
    };
    if (!options.hideBallStats) {
        for (const textElementName in textElements) {
            if (textElements.hasOwnProperty(textElementName)) {
                textElements[textElementName] = parent.appendNewElement("h4");
            }
        }
    }
    const canvasDiv = parent.appendNewElement("div");
    parent.appendBr();
    parent.appendBr();
    const game = game_1.newGame()
        .name(options.name || "Bouncing Ball")
        .newCanvas(canvasDiv, options.canvas)
        .size(options.gameWidth, options.gameHeight)
        .build();
    if (numBalls === 0) {
        return game;
    }
    const balls = new Array(numBalls)
        .fill(null)
        .map(() => exports.newBouncingBall({
        numBouncesText: textElements.numBounces,
        speedText: textElements.speedText,
        angleText: textElements.angleText,
        minBounceInterval: 2,
        radiusX: () => options.ballRadiusX,
        radiusY: () => options.ballRadiusY,
        initialSpeed: () => options.initialBallSpeed,
        initialAngle: () => utils_1.MathUtils.randomRange(-Math.PI, Math.PI),
        render: options.ballRenderer,
    }));
    balls.forEach(ball => game.addActor(ball));
    parent.appendChild(game.start.button.withInnerText("Start"));
    parent.appendChild(game.stop.button.withInnerText("Pause"));
    parent.appendChild(game.resume.button.withInnerText("Resume"));
    parent.appendChild(game.restart.button.withInnerText("Restart"));
    const ball = balls[0];
    const privateBall = ball;
    // change speed and angle
    window.addEventListener("keydown", function (e) {
        const deltaSpeed = keys_1.keyCodeToDeltaSpeed(e.keyCode);
        privateBall.speed += deltaSpeed;
        if (deltaSpeed !== 0) {
            e.preventDefault();
        }
        ball.setSpeedText();
        const deltaAngle = ball.speed * utils_1.MathUtils.deg2rad(keys_1.keyCodeToDeltaAngle(e.keyCode));
        privateBall.angle = (ball.angle + deltaAngle) % utils_1.MathUtils.TAU;
        if (deltaAngle !== 0) {
            e.preventDefault();
        }
        ball.setAngleText();
    });
    const anyGame = game;
    anyGame.balls = balls;
    anyGame.ball = ball;
    return game;
};
exports.runBouncingBallGame = function (options) {
    const game = exports.newBouncingBallGame(options);
    game.start();
    return game;
};
