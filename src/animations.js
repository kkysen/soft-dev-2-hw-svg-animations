"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bouncingBall_1 = require("./bouncingBall");
const expandingBall_1 = require("./expandingBall");
const listener_1 = require("./listener");
const canvasCanvas_1 = require("./canvasCanvas");
var AnimationIndex;
(function (AnimationIndex) {
    AnimationIndex[AnimationIndex["EXPANDING_BALL"] = 0] = "EXPANDING_BALL";
    AnimationIndex[AnimationIndex["BOUNCING_BALL"] = 1] = "BOUNCING_BALL";
    AnimationIndex[AnimationIndex["BOUNCING_BALLS"] = 2] = "BOUNCING_BALLS";
    AnimationIndex[AnimationIndex["JUMPING_KIRAN"] = 3] = "JUMPING_KIRAN";
    AnimationIndex[AnimationIndex["JUMPING_KORA"] = 4] = "JUMPING_KORA";
    AnimationIndex[AnimationIndex["DVD_PLAYER_SCREEN_SAVER"] = 5] = "DVD_PLAYER_SCREEN_SAVER";
    AnimationIndex[AnimationIndex["NUM_ANIMATIONS"] = 6] = "NUM_ANIMATIONS";
})(AnimationIndex = exports.AnimationIndex || (exports.AnimationIndex = {}));
const checkAnimationIndex = function (animationIndex) {
    if (animationIndex >= AnimationIndex.NUM_ANIMATIONS) {
        throw new Error("animationIndex can't >= NUM_ANIMATIONS");
    }
};
const renderImageAsBall = function (image) {
    return function (game, ball) {
        game.canvas.drawImage(image, ball.x - ball.radiusX, ball.y - ball.radiusY, ball.radiusX * 2, ball.radiusY * 2);
    };
};
// TODO
const useImageBitmap = false; // good for Canvas, bad for SVG
const newBouncingImageGame = function (canvas, parent, imageFile, name = "Bouncing Image") {
    const maxWidth = 250;
    const maxHeight = 250;
    const img = new Image();
    img.src = imageFile;
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = (e) => reject({
            reason: "Unable to load image \"" + imageFile + "\"",
            event: e,
        });
    })
        .then(img => (canvas === canvasCanvas_1.CanvasCanvas.new ? createImageBitmap(img) : img))
        .then(img => {
        const scale = 0.5 * Math.min(1, maxWidth / img.width, maxHeight / img.height);
        console.log(img);
        console.log(scale);
        return bouncingBall_1.newBouncingBallGame({
            canvas: canvas,
            name: name,
            parent: parent,
            gameWidth: 600,
            gameHeight: 600,
            ballRadiusX: img.width * scale,
            ballRadiusY: img.height * scale,
            initialBallSpeed: 10,
            ballRenderer: renderImageAsBall(img),
        });
    });
};
const newJumpingKiranGame = function (canvas, parent) {
    const fileName = "resources/JumpingKiran.png";
    const name = "Jumping Kiran";
    return newBouncingImageGame(canvas, parent, fileName, name);
};
const newJumpingKoraGame = function (canvas, parent) {
    const fileName = "resources/JumpingKora.png";
    const name = "Jumping Kora";
    return newBouncingImageGame(canvas, parent, fileName, name);
};
const newDVDPlayerScreenSaver = function (canvas, parent) {
    const fileName = "resources/DVDPlayerLogo.jpg";
    const name = "DVD Player Screen Saver";
    return newBouncingImageGame(canvas, parent, fileName, name).then(game => {
        game.start.button.innerText = "I'm waiting for the movie to start";
        game.stop.button.innerText = "STOP";
        return game;
    });
};
const newAnimationGameUnchecked = function (canvas, animationIndex, parent) {
    switch (animationIndex) {
        case AnimationIndex.NUM_ANIMATIONS:
            checkAnimationIndex(animationIndex);
            return null;
        case AnimationIndex.EXPANDING_BALL:
            return Promise.resolve(expandingBall_1.newExpandingBallGame({
                canvas: canvas,
                parent: parent,
                gameWidth: 600,
                gameHeight: 600,
                initialBallRadius: 50,
                initialBallRadiusSpeed: 1,
            }));
        case AnimationIndex.BOUNCING_BALL:
            return Promise.resolve(bouncingBall_1.newBouncingBallGame({
                canvas: canvas,
                parent: parent,
                gameWidth: 600,
                gameHeight: 600,
                ballRadiusX: 50,
                ballRadiusY: 50,
                initialBallSpeed: 25,
            }));
        case AnimationIndex.BOUNCING_BALLS:
            const game = bouncingBall_1.newBouncingBallGame({
                canvas: canvas,
                name: "Bouncing Balls",
                parent: parent,
                gameWidth: 600,
                gameHeight: 600,
                ballRadiusX: 10,
                ballRadiusY: 10,
                initialBallSpeed: 15,
                numBalls: 10,
            });
            // game.ball.render = ;
            return Promise.resolve(game);
        case AnimationIndex.JUMPING_KIRAN:
            return newJumpingKiranGame(canvas, parent);
        case AnimationIndex.JUMPING_KORA:
            return newJumpingKoraGame(canvas, parent);
        case AnimationIndex.DVD_PLAYER_SCREEN_SAVER:
            return newDVDPlayerScreenSaver(canvas, parent);
    }
};
const newAnimationGame = function (canvas, animationIndex, parent) {
    return new Promise(resolve => {
        newAnimationGameUnchecked(canvas, animationIndex, parent)
            .then(resolve)
            .catch(error => {
            console.log(error);
            resolve(null);
        });
    });
};
const newAnimation = function (canvas, animationIndex) {
    const div = document.body.appendDiv();
    div.hidden = true;
    return {
        index: animationIndex,
        div: div,
        game: newAnimationGame(canvas, animationIndex, div),
        paused: false,
    };
};
exports.run = function (canvas, animationIndex) {
    checkAnimationIndex(animationIndex);
    const parent = document.body.appendNewElement("center");
    parent.appendBr();
    const switchAnimationButton = parent.appendButton("Switch Animation");
    const animationName = parent.appendNewElement("h3");
    const animations = new Array(AnimationIndex.NUM_ANIMATIONS)
        .fill(null)
        .map((e, i) => newAnimation(canvas, i));
    parent.appendBr();
    const switchAnimation = function () {
        const prevAnimation = animations[animationIndex];
        prevAnimation.div.hidden = true; // hide last one
        prevAnimation.game.then(game => {
            // if (game && game.running) {
            //     game.stop();
            //     prevAnimation.paused = true;
            // }
        });
        animationIndex = (animationIndex + 1) % animations.length; // switch to next
        const animation = animations[animationIndex];
        console.log("switching to:", animation);
        animation.div.hidden = false; // show new one
        animation.game.then(game => {
            if (!game) {
                // if this game wasn't loaded, skip to next
                switchAnimation();
                return;
            }
            // if (prevAnimation.paused) {
            //     game.resume();
            //     prevAnimation.paused = false;
            // }
            animationName.innerText = game.name;
        });
    };
    animationIndex = (animationIndex + animations.length - 1) % animations.length; // decrease to start with correct one
    switchAnimation();
    listener_1.newListener(switchAnimation).click(switchAnimationButton);
};
