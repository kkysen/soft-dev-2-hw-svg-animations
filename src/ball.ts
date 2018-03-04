import {Actor, Game} from "./game";

export interface Ball extends Actor {
    
    readonly x: number;
    readonly y: number;
    
    readonly radiusX: number;
    readonly radiusY: number;
    
}

export interface BallRenderer {
    
    (game: Game, ball: Ball): void;
    
}