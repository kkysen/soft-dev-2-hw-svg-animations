import {Actor, Game, GameRenderer, GameUpdater, newGame} from "./game";
import {MathUtils} from "./utils";
import {newListener} from "./listener";
import {keyCodeToDeltaAngle, keyCodeToDeltaSpeed} from "./keys";
import {Ball, BallRenderer} from "./ball";
import {CanvasConstructor, SVGCanvas} from "./svgCanvas";

export interface ExpandingBallOptions {
    
    initialRadius: number,
    initialRadiusSpeed: number,
    
    render?: GameRenderer;
    
}

interface PrivateExpandingBall {
    
    radiusX: number;
    radiusY: number;
    radiusSpeed: number;
    x: number;
    y: number;
    
}

export interface ExpandingBall extends Ball {
    
    readonly initialRadius: number;
    readonly initialRadiusSpeed: number;
    
    readonly radiusSpeed: number;
    
    onRadiusSpeedReversal?: () => any;
    
}

export const newExpandingBall = function(options: ExpandingBallOptions): ExpandingBall {
    
    const reset = function(game: Game): void {
        privateBall.radiusX = ball.initialRadius;
        privateBall.radiusY = ball.initialRadius;
        privateBall.radiusSpeed = ball.initialRadiusSpeed;
        privateBall.x = game.canvas.width / 2;
        privateBall.y = game.canvas.height / 2;
    };
    
    const reverseRadiusSpeed = function(direction: number) {
        privateBall.radiusSpeed = direction * Math.abs(ball.radiusSpeed);
        if (ball.onRadiusSpeedReversal) {
            ball.onRadiusSpeedReversal();
        }
    };
    
    const update: GameUpdater = function(game: Game): void {
        let radiusX: number = ball.radiusX;
        let radiusY: number = ball.radiusY;
        radiusX += ball.radiusSpeed;
        radiusY += ball.radiusSpeed;
        
        if (radiusX < 0) {
            radiusX = 0;
            reverseRadiusSpeed(1);
        } else if (2 * radiusX > game.canvas.width) {
            reverseRadiusSpeed(-1);
        }
        if (radiusY < 0) {
            radiusY = 0;
            reverseRadiusSpeed(1);
        } else if (2 * radiusY > game.canvas.height) {
            reverseRadiusSpeed(-1);
        }
        
        privateBall.radiusX = radiusX;
        privateBall.radiusY = radiusY;
    };
    
    const ballRenderer: BallRenderer = options.render;
    
    const delegateRender: GameRenderer = function(game: Game): void {
        ballRenderer(game, ball);
    };
    
    const ownRender: GameRenderer = function(game: Game): void {
        game.canvas.fillEllipse(ball.x, ball.y, ball.radiusX, ball.radiusY);
    };
    
    const render: GameRenderer = options.render ? delegateRender : ownRender;
    
    const ball: ExpandingBall = {
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
    
    const privateBall: PrivateExpandingBall = ball;
    
    return ball;
    
};

export interface ExpandingBallGameOptions {
    
    canvas: CanvasConstructor;
    
    parent: HTMLElement;
    
    gameWidth: number;
    gameHeight: number;
    
    initialBallRadius: number;
    initialBallRadiusSpeed: number;
    
    ballRenderer?: GameRenderer;
    
}

export interface ExpandingBallGame extends Game {
    
    readonly ball: ExpandingBall;
    
}

export const newExpandingBallGame = function(options: ExpandingBallGameOptions): ExpandingBallGame {
    
    const parent = options.parent.appendNewElement("center");
    
    parent.appendNewElement("h4").innerText = "Use UP and DOWN arrow keys to change the speed of the radius.";
    
    const canvasDiv: HTMLDivElement = parent.appendNewElement("div");
    
    parent.appendBr();
    
    const game: Game = newGame()
        .name("Expanding Ball")
        .newCanvas(canvasDiv, options.canvas)
        .size(options.gameWidth, options.gameHeight)
        .build();
    
    parent.appendChild(game.start.button.withInnerText("I'm an Animaniac"));
    parent.appendChild(game.stop.button.withInnerText("STOP"));
    parent.appendChild(game.resume.button.withInnerText("Resume"));
    const reverseDirectionButton: HTMLButtonElement = parent.appendButton("Reverse Direction");
    parent.appendChild(game.reset.button.withInnerText("Reset"));
    
    const ball: ExpandingBall = newExpandingBall({
        initialRadius: options.initialBallRadius,
        initialRadiusSpeed: options.initialBallRadiusSpeed,
        render: options.ballRenderer,
    });
    
    const updateReverseDirectionButtonText = function() {
        reverseDirectionButton.innerText =
            ball.radiusSpeed === 0
                ? "Reverse Direction"
                : ball.radiusSpeed < 0
                ? "Grow" : "Shrink";
    };
    
    ball.onRadiusSpeedReversal = updateReverseDirectionButtonText;
    
    const privateBall: PrivateExpandingBall = ball;
    
    game.addActor(ball);
    
    newListener(() => {
        console.log("reversing");
        privateBall.radiusSpeed *= -1;
        updateReverseDirectionButtonText();
    }).click(reverseDirectionButton);
    
    updateReverseDirectionButtonText();
    
    // change speed
    window.addEventListener("keydown", function(e: KeyboardEvent) {
        const deltaSpeed: number = keyCodeToDeltaSpeed(e.keyCode);
        privateBall.radiusSpeed += Math.sign(ball.radiusSpeed) * deltaSpeed;
        if (ball.radiusSpeed === 0) {
            privateBall.radiusSpeed += deltaSpeed;
        }
        if (deltaSpeed !== 0) {
            e.preventDefault();
        }
    });
    
    (<any> game).ball = ball;
    return <ExpandingBallGame> game;
};