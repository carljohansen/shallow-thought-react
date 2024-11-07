import * as Chess from '../engine/ChessElements';
import { ISingleMovePlayer, MoveEvent, ProgressUpdatedEvent } from './PlayerInterface';

export class ArtificialSingleMovePlayer implements ISingleMovePlayer {

    private engineWorker: Worker | undefined;
    private playedMove?: Chess.GameMove;
    private handleProgress?: (e: ProgressUpdatedEvent) => void;

    constructor(public readonly board: Chess.Board,
        public readonly handleMove: (e: MoveEvent) => void) {

        this.engineWorker = undefined;
    }

    useProgressHandler(handleProgress: (e: ProgressUpdatedEvent) => void) {
        this.handleProgress = handleProgress;
    }

    // Computer player does not care what the user clicks.
    handleMoveSelection = () => { }

    activate(): void {

        if (!this.engineWorker) {
            this.engineWorker = new Worker(new URL('../../artificialPlayerDispatch.ts', import.meta.url), { type: 'module' });
            this.engineWorker.onmessage = this.onMoveDecision;
        }
        if (this.handleProgress) {
            this.handleProgress(new CustomEvent("progress", { detail: 0 }));
        }
        this.engineWorker.postMessage(this.board);
    }

    private onMoveDecision = (e: MessageEvent) => {

        const matchProgress = (data: string) => {
            const myRegexp = /PROGRESS:(.+)/g;
            const match = myRegexp.exec(data);
            return match ? parseInt(match[1], 10) : null;
        };

        let progress: number | null;
        if ((progress = matchProgress(e.data)) !== null) {
            if (this.handleProgress) {
                this.handleProgress(new CustomEvent("progress", { detail: progress }));
            }
            return;
        }

        const chosenMoveAsObj = <Chess.GameMove>e.data;
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
