import * as Chess from '../engine/ChessElements';
import { ISingleMovePlayer, MoveEvent, ProgressUpdatedEvent } from './PlayerInterface';

export class HumanSingleMovePlayer implements ISingleMovePlayer {

    private isActive: boolean = false;
    private playedMove: Chess.GameMove;

    constructor(public readonly board: Chess.Board,
        public readonly handleMove: (e: MoveEvent) => void,
        public readonly handleProgress: (e: ProgressUpdatedEvent) => void) {

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
