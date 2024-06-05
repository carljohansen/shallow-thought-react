import * as Chess from '../engine/ChessElements';
import { ISingleMovePlayer, MoveEvent, ProgressUpdatedEvent } from './PlayerInterface';

export class ArtificialSingleMovePlayer implements ISingleMovePlayer {

    private engineWorker: Worker;
    private playedMove: Chess.GameMove;
    private board: Chess.Board;
    private handleMove: (e: MoveEvent) => void;
    private handleProgress: (e: ProgressUpdatedEvent) => void;

    constructor(board: Chess.Board,
        handleMove: (e: MoveEvent) => void,
        handleProgress: (e: ProgressUpdatedEvent) => void) {

        this.engineWorker = undefined;
        this.board = board;
        this.handleMove = handleMove;
        this.handleProgress = handleProgress;
    }

    // Computer player does not care what the user clicks.
    handleMoveSelection: (e: MoveEvent) => void;

    activate(): void {

        if (!this.engineWorker) {
            this.engineWorker = new Worker(new URL('../../artificialPlayerDispatch.ts', import.meta.url));
            this.engineWorker.onmessage = this.onMoveDecision;
        }
        this.handleProgress(new CustomEvent("progress", { detail: 0 }));
        this.engineWorker.postMessage(this.board);
    }

    private onMoveDecision = (e: MessageEvent) => {

        var matchProgress = (data: any) => {
            const myRegexp = /PROGRESS:(.+)/g;
            var match = myRegexp.exec(data);
            return match ? parseInt(match[1], 10) : null;
        };

        let progress: number;
        if ((progress = matchProgress(e.data)) !== null) {
            this.handleProgress(new CustomEvent("progress", { detail: progress }));
            return;
        }

        const chosenMoveAsObj = e.data;
        if (!chosenMoveAsObj) {
            // We are unable to move.  It's either mate or stalemate.
            this.handleMove(new CustomEvent("UnableToMove", { detail: null }));
        } else {
            this.playedMove = Chess.GameMove.deserialize(e.data);
            this.handleMove(new CustomEvent("moveMade", { detail: this.playedMove }));
        }
    };

    public dispose(): void {
        if (this.engineWorker) {
            this.engineWorker.terminate();
            this.engineWorker = undefined;
        }
    }
}
