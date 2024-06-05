import * as Chess from '../engine/ChessElements';
import { ISingleMovePlayer, MoveEvent } from './PlayerInterface';

export class HumanSingleMovePlayer implements ISingleMovePlayer {

    private isActive: boolean = false;
    private playedMove: Chess.GameMove;
    private board: Chess.Board;
    private handleMove: (e: MoveEvent) => void;

    constructor(board: Chess.Board,
        handleMove: (e: MoveEvent) => void) {

        this.board = board;
        this.handleMove = handleMove;
    }

    activate(): void {
        this.isActive = true;
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
