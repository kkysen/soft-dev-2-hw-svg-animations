import {Game, GameRenderer, GameUpdater, newGame, Vector} from "./game";
import {MathUtils, nullTextElement, TextElement} from "./utils";
import {keyCodeToDeltaAngle, keyCodeToDeltaSpeed} from "./keys";
import {Ball, BallRenderer} from "./ball";
import {Canvas, CanvasConstructor, SVGCanvas} from "./svgCanvas";

export interface BouncingBallOptions {
    
    numBouncesText: HTMLElement;
    speedText: HTMLElement;
    angleText: HTMLElement;
    minBounceInterval?: number;
    radiusX: () => number;
    radiusY: () => number;
    initialSpeed: () => number;
    initialAngle: () => number;
    
    render?: BallRenderer;
    
}

interface PrivateBouncingBall {
    
    initialSpeed: number;
    initialAngle: number;
    
    x: number;
    y: number;
    
    speed: number;
    angle: number;
    
    lastXBounceTick: number;
    lastYBounceTick: number;
    numBounces: number;
    
}

export interface BouncingBall extends Ball {
    
    readonly numBouncesText: TextElement;
    readonly speedText: TextElement;
    readonly angleText: TextElement;
    
    setNumBouncesText(numBounces?: number): void;
    setSpeedText(speed?: number): void;
    setAngleText(angle?: number): void;
    
    readonly minBounceInterval: number;
    
    readonly initialSpeed: number;
    readonly initialAngle: number;
    
    readonly speed: number;
    readonly angle: number;
    
    readonly lastXBounceTick: number;
    readonly lastYBounceTick: number;
    readonly numBounces: number;
    
}

export const newBouncingBall = function(options: BouncingBallOptions): BouncingBall {
    if (!options.minBounceInterval) {
        options.minBounceInterval = 2; // default
    }
    
    const setNumBouncesText = function(numBounces: number = ball.numBounces): void {
        ball.numBouncesText.innerText = "Number of Bounces: " + numBounces;
    };
    
    const setAngleText = function(angle: number = ball.angle): void {
        ball.angleText.innerText = "Angle: " + MathUtils.angleToString(angle);
    };
    
    const setSpeedText = function(speed: number = ball.speed): void {
        ball.speedText.innerText = "Speed: " + speed;
    };
    
    const reset = function(game: Game): void {
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
        
        console.log("Initial Angle: " + MathUtils.angleToString(ball.initialAngle));
    };
    
    const update: GameUpdater = function(game: Game): void {
        const canvas: Canvas = game.canvas;
        const radiusX: number = ball.radiusX;
        const radiusY: number = ball.radiusY;
        let x: number = ball.x;
        let y: number = ball.y;
        let angle: number = ball.angle;
        const xBounce = x < radiusX || x > canvas.width - radiusX;
        const yBounce = y < radiusY || y > canvas.height - radiusY;
        if (game.tick - ball.lastXBounceTick > ball.minBounceInterval && xBounce) {
            angle = -(Math.PI + angle) % MathUtils.TAU;
            privateBall.lastXBounceTick = game.tick;
        } else if (game.tick - ball.lastYBounceTick > ball.minBounceInterval && yBounce) {
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
        
        const speed: number = ball.speed;
        const delta: number = 1; // this.delta * 0.01;
        x += speed * Math.cos(angle) * delta;
        y += speed * Math.sin(angle) * delta;
        
        privateBall.angle = angle;
        privateBall.x = x;
        privateBall.y = y;
    };
    
    const ballRenderer: BallRenderer = options.render;
    
    const delegateRender: GameRenderer = function(game: Game): void {
        ballRenderer(game, ball);
    };
    
    const ownRender: GameRenderer = function(game: Game): void {
        game.canvas.fillEllipse(ball.x, ball.y, ball.radiusX, ball.radiusY);
    };
    
    const render: GameRenderer = options.render ? delegateRender : ownRender;
    
    const ball: BouncingBall = {
        
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
    
    const privateBall: PrivateBouncingBall = ball;
    
    return ball;
};

export interface BouncingBallGameOptions {
    
    canvas: CanvasConstructor;
    
    name?: string;
    
    parent: HTMLElement;
    
    gameWidth: number;
    gameHeight: number;
    
    numBalls?: number;
    
    ballRadiusX?: number;
    ballRadiusY?: number;
    
    initialBallSpeed: number;
    
    hideBallStats?: boolean;
    
    ballRenderer?: BallRenderer;
    
}

export interface BouncingBallGame extends Game {

    readonly balls: BouncingBall[];
    
    readonly ball: BouncingBall;
    
}

export const newBouncingBallGame = function(options: BouncingBallGameOptions): BouncingBallGame {
    
    const numBalls: number = options.numBalls === undefined ? 1 : options.numBalls;
    if (numBalls < 0) {
        throw new Error("options.numBalls must be non-negative");
    }
    
    const parent = options.parent.appendNewElement("center");
    
    parent.appendNewElement("h4").innerText = "Use UP and DOWN arrow keys to change the velocity.";
    parent.appendNewElement("h4").innerText = "Use LEFT and RIGHT arrow keys to change the angle.";
    
    const textElements: any = {
        numBounces: nullTextElement,
        angleText: nullTextElement,
        speedText: nullTextElement,
    };
    
    if (!options.hideBallStats) {
        for (const textElementName in textElements) {
            if (textElements.hasOwnProperty(textElementName)) {
                textElements[textElementName] = parent.appendNewElement("h4");
            }
        }
    }
    
    const canvasDiv: HTMLDivElement = parent.appendNewElement("div");
    
    parent.appendBr();
    parent.appendBr();
    
    const game: Game = newGame()
        .name(options.name || "Bouncing Ball")
        .newCanvas(canvasDiv, options.canvas)
        .size(options.gameWidth, options.gameHeight)
        .build();
    
    if (numBalls === 0) {
        return <BouncingBallGame> game;
    }
    
    const balls: BouncingBall[] = new Array(numBalls)
        .fill(null)
        .map(() => newBouncingBall({
                numBouncesText: textElements.numBounces,
                speedText: textElements.speedText,
                angleText: textElements.angleText,
        
                minBounceInterval: 2,
                radiusX: () => options.ballRadiusX,
                radiusY: () => options.ballRadiusY,
        
                initialSpeed: () => options.initialBallSpeed,
                initialAngle: () => MathUtils.randomRange(-Math.PI, Math.PI),
        
                render: options.ballRenderer,
            })
        );
    balls.forEach(ball => game.addActor(ball));
    
    parent.appendChild(game.start.button.withInnerText("Start"));
    parent.appendChild(game.stop.button.withInnerText("Pause"));
    parent.appendChild(game.resume.button.withInnerText("Resume"));
    parent.appendChild(game.restart.button.withInnerText("Restart"));
    
    const ball: BouncingBall = balls[0];
    const privateBall: PrivateBouncingBall = ball;
    
    // change speed and angle
    window.addEventListener("keydown", function(e: KeyboardEvent) {
        const deltaSpeed: number = keyCodeToDeltaSpeed(e.keyCode);
        privateBall.speed += deltaSpeed;
        if (deltaSpeed !== 0) {
            e.preventDefault();
        }
        ball.setSpeedText();
        
        const deltaAngle: number = ball.speed * MathUtils.deg2rad(keyCodeToDeltaAngle(e.keyCode));
        privateBall.angle = (ball.angle + deltaAngle) % MathUtils.TAU;
        if (deltaAngle !== 0) {
            e.preventDefault();
        }
        ball.setAngleText();
    });
    
    const anyGame: any = game;
    anyGame.balls = balls;
    anyGame.ball = ball;
    return <BouncingBallGame> game;
};

export const runBouncingBallGame = function(options?: BouncingBallGameOptions): BouncingBallGame {
    const game: BouncingBallGame = newBouncingBallGame(options);
    game.start();
    return game;
};