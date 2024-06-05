import * as Chess from '../engine/ChessElements';
import { ISingleMovePlayer, MoveEvent, ProgressUpdatedEvent } from './PlayerInterface';

export class HumanSingleMovePlayer implements ISingleMovePlayer {

    private isActive: boolean = false;
    private playedMove: Chess.GameMove;
    private board: Chess.Board;
    private handleMove: (e: MoveEvent) => void;
    private handleProgress: (e: ProgressUpdatedEvent) => void;

    constructor(board: Chess.Board,
        handleMove: (e: MoveEvent) => void,
        handleProgress: (e: ProgressUpdatedEvent) => void) {

        this.board = board;
        this.handleMove = handleMove;
        this.handleProgress = handleProgress;
    }

    activate(): void {
        this.isActive = true;
        this.handleProgress(new CustomEvent("progress", { detail: 0 }));
    }
    dispose(): void {
    }

    public handleMoveSelection = (e: MoveEvent) => {
        if (!this.isActive) {
            return;
        }
        this.handleMove(new CustomEvent("moveMade", { detail: e.detail }));
    };
}
