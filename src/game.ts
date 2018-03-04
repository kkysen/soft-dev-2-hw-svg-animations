import {Listener, newListener} from "./listener";
import {Canvas, CanvasConstructor} from "./svgCanvas";

export interface Vector {
    
    x: number;
    y: number;
    
}

export interface GameUpdater {
    
    (game: Game): void;
    
}

export interface GameRenderer {
    
    (game: Game): void;
    
}

interface PrivateGame {
    
    id?: number;
    
    game?: Game;
    
    remove?: () => void;
    
}

export interface Actor {
    
    readonly id?: number;
    
    readonly game?: Game;
    
    readonly update: GameUpdater;
    
    readonly render: GameRenderer;
    
    reset(game: Game): void;
    
    readonly remove?: () => void;
    
}

interface GameFrame {
    
    tick: number;
    time?: number;
    delta: number;
    prevId?: number;
    
    running: boolean;
    paused: boolean;
    
}

export interface GameAction {
    
    (): void;
    
    readonly listener: Listener;
    
    readonly button: HTMLButtonElement;
    
}

const newGameAction = function(action: () => void): GameAction {
    const gameAction: any = action;
    gameAction.listener = newListener(action);
    gameAction.button = document.createElement("button");
    gameAction.listener.click(gameAction.button);
    return <GameAction> gameAction;
};

export interface Game {
    
    readonly name: string;
    
    readonly canvas: Canvas;
    readonly parent: HTMLElement;
    
    readonly tick: number;
    readonly time?: number;
    readonly delta: number;
    readonly prevId?: number;
    
    clearFrame: boolean;
    
    clear(): void;
    
    readonly start: GameAction;
    readonly stop: GameAction;
    readonly resume: GameAction;
    readonly reset: GameAction;
    readonly restart: GameAction;
    
    readonly running: boolean;
    readonly paused: boolean;
    
    readonly actors: Actor[];
    
    addActor(actor: Actor): void;
    
    removeActor(actor: Actor): void;
    
}

export interface GameBuilder {
    
    name(name: string): GameBuilder;
    
    canvas(canvas: Canvas): GameBuilder;
    
    newCanvas(canvasParent: HTMLElement, canvasSupplier: CanvasConstructor): GameBuilder;
    
    width(width: number): GameBuilder;
    
    height(height: number): GameBuilder;
    
    size(width: number, height: number): GameBuilder;
    
    size(size: Vector): GameBuilder;
    
    build(): Game;
    
}

interface GameBuilderFields {
    
    name?: string;
    canvas?: Canvas;
    width?: number;
    height?: number;
    
}

export const newGame = function(): GameBuilder {
    return (function(): GameBuilder {
        
        const fields: GameBuilderFields = {
            name: null,
            canvas: null,
            width: null,
            height: null,
        };
        
        const checkFieldsInitialized = function(): void {
            for (const field in fields) {
                if (fields.hasOwnProperty(field)) {
                    if (!fields[field]) {
                        throw new Error(field + " not set");
                    }
                }
            }
        };
        
        const builder: GameBuilder = {
            
            name: function(name: string): GameBuilder {
                fields.name = name;
                return builder;
            },
            
            canvas: function(canvas: Canvas): GameBuilder {
                fields.canvas = canvas;
                return builder;
            },
            
            newCanvas: function(canvasParent: HTMLElement, canvasSupplier: CanvasConstructor): GameBuilder {
                fields.canvas = canvasSupplier();
                fields.canvas.appendTo(canvasParent);
                return builder;
            },
            
            width: function(width: number): GameBuilder {
                fields.width = width;
                return builder;
            },
            
            height: function(height: number): GameBuilder {
                fields.height = height;
                return builder;
            },
            
            size: function(widthOrSize: number | Vector, height?: number): GameBuilder {
                let width;
                if (height === undefined) {
                    const size: Vector = <Vector> widthOrSize;
                    width = size.x;
                    height = size.y;
                } else {
                    width = <number> widthOrSize;
                }
                return builder.width(width).height(height);
            },
            
            build: function(): Game {
                checkFieldsInitialized();
                
                const canvas: Canvas = fields.canvas;
                const parent: HTMLElement = canvas.parentElement;
                canvas.width = fields.width;
                canvas.height = fields.height;
                
                const actors: Actor[] = [];
                
                canvas.style.border = "1px solid black";
                
                const game: Game = {
                    
                    name: fields.name,
                    
                    canvas: canvas,
                    parent: parent,
                    tick: 0,
                    time: null,
                    delta: 0,
                    prevId: null,
                    
                    clearFrame: true,
                    
                    clear: function(): void {
                        canvas.clear();
                    },
                    
                    start: newGameAction(() => {
                        resume(true);
                        frame.paused = false;
                        frame.running = true;
                    }),
                    
                    stop: newGameAction(() => {
                        window.cancelAnimationFrame(game.prevId);
                        frame.prevId = null;
                        frame.time = null;
                        frame.paused = true;
                    }),
                    
                    resume: newGameAction(() => {
                        resume(false);
                        frame.paused = false;
                    }),
                    
                    reset: newGameAction(() => {
                        actors.forEach(actor => actor.reset(game));
                    }),
                    
                    restart: newGameAction(() =>  {
                        game.stop();
                        game.reset();
                        game.start();
                    }),
                    
                    running: false,
                    paused: false,
                    
                    actors: actors,
                    
                    addActor: function(actor: Actor): void {
                        actors.push(actor);
                        
                        const privateGame: PrivateGame = actor;
                        privateGame.game = game;
                        privateGame.id = actors.length;
                        privateGame.remove = function(this: Actor) {
                            this.game.removeActor(this);
                        }
                    },
                    
                    removeActor: function(actor: Actor): void {
                        actors.splice(actor.id, 1);
                        const privateGame: PrivateGame = actor;
                        privateGame.game = null;
                        privateGame.id = null;
                    },
                    
                };
                
                const frame: GameFrame = game;
                
                const update: GameUpdater = function(game: Game) {
                    actors.forEach(actor => actor.update(game));
                };
                
                const render: GameRenderer = function(game: Game) {
                    if (game.clearFrame) {
                        game.clear();
                    }
                    actors.forEach(actor => actor.render(game));
                };
                
                const gameLoop = function(time) {
                    frame.tick++;
                    frame.delta = game.time === null ? 0 : time - game.time;
                    frame.time = time;
                    update(game);
                    render(game);
                    frame.prevId = window.requestAnimationFrame(gameLoop);
                };
                
                const resume = function(reset: boolean) {
                    if (reset) {
                        game.reset();
                    }
                    if (!frame.prevId) {
                        // if not already stopped
                        frame.prevId = window.requestAnimationFrame(gameLoop);
                        console.log("starting");
                    }
                };
                
                return game;
            },
            
        };
        
        return builder;
        
    }).call({});
};