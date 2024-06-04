import * as Chess from '../engine/ChessElements';
import { PlayerBase } from './PlayerBase';

export class ArtificialPlayer extends PlayerBase {

    private engineWorker: Worker;
    private playedMove: Chess.GameMove;

    constructor(colour: Chess.Player) {
        //super(colour);
        super();
        this.engineWorker = undefined;
    }

    activate(board: Chess.Board): void {

        if (!this.engineWorker) {
            this.engineWorker = new Worker(new URL('../../artificialPlayerDispatch.ts', import.meta.url));
            this.engineWorker.onmessage = this.onMoveDecision;
        }
        this.progress$.next(0);
        this.engineWorker.postMessage(board);
    }

    public onMoveDecision = (e: MessageEvent) => {

        var matchProgress = (data: any) => {
            const myRegexp = /PROGRESS:(.+)/g;
            var match = myRegexp.exec(data);
            return match ? parseInt(match[1], 10) : null;
        };

        let progress: number;
        if ((progress = matchProgress(e.data)) !== null) {
            this.progress$.next(progress);
            return;
        }

        const chosenMoveAsObj = e.data;
        if (!chosenMoveAsObj) {
            // We are unable to move.  It's either mate or stalemate.
            this.move$.next(null);
        } else {
            this.playedMove = Chess.GameMove.deserialize(e.data);
            this.move$.next(this.playedMove);
        }
    };

    public deactivate(): void {
        this.playedMove = null;
    }

    public dispose(): void {
        if (this.engineWorker) {
            this.engineWorker.terminate();
            this.engineWorker = undefined;
        }
    }
}
