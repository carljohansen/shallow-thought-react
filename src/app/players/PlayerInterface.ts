import * as Chess from '../engine/ChessElements'

export interface ISingleMovePlayer {

    // Activates the player so that it can make its move.
    activate(): void;

    dispose(): void;

    // Handles the human user's selection of a move.
    handleMoveSelection: (e: MoveEvent) => void;

    useProgressHandler: (handleProgress: (e: ProgressUpdatedEvent) => void) => void;
}

export type MoveEvent = CustomEvent<Chess.GameMove | null>;

export type ProgressUpdatedEvent = CustomEvent<number>;

export class NullPlayer implements ISingleMovePlayer {

    activate(): void {
    }
    dispose(): void {
    }
    handleMoveSelection: (e: MoveEvent) => void = () => { };
    useProgressHandler: (handleProgress: (e: ProgressUpdatedEvent) => void) => void = () => { };
}
