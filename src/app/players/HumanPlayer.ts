import * as Chess from '../engine/ChessElements';
import { PlayerBase } from './PlayerBase';


export class HumanPlayer extends PlayerBase {

    private isActive: boolean;

    constructor(colour: Chess.Player) {
        //super(colour);
        super();
        this.isActive = false;
    }

    activate(board: Chess.Board): void {
        if (!this.isActive) {
            this.isActive = true;
        }
    }

    onSquareSelected(square: Chess.BoardSquare) {
        if (!this.isActive) {
            return;
        }

        // if (!this.selectedFromSquare) {
        //     // Nothing currently selected so we're choosing a source square.
        //     this.selectedFromSquare = square;
        //     this.selectedFromSquare.select();
        //     return;
        // }
        // if (this.selectedFromSquare.algebraicName === square.algebraicName) {
        //     // User is re-selecting the from square; we call that a cancellation.
        //     this.selectedFromSquare.deselect();
        //     this.selectedFromSquare = null;
        //     return;
        // }
        // // We have a move!
        // const toSquare = square;
        // this.move$.next({ fromSquare: this.selectedFromSquare.square, toSquare: toSquare.square });
    }

    public deactivate(): void {
        // if (this.selectedFromSquare) {
        //     this.selectedFromSquare.deselect();
        //     this.selectedFromSquare = null;
        // }
    }
}
