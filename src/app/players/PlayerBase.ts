import { Subject } from 'rxjs';
import * as Chess from '../engine/ChessElements'

export abstract class PlayerBase {

    //   @Output() move: EventEmitter<Chess.GameMove> = new EventEmitter();
    //   @Output() progress: EventEmitter<number> = new EventEmitter();
    public move$ = new Subject<Chess.GameMove>();
    public progress$ = new Subject<number>();

    //constructor(colour: Chess.Player) {    }

    abstract activate(board: Chess.Board): void;
    abstract deactivate(): void;

    onSquareSelected(square: Chess.BoardSquare) {
        // default implementation does nothing.
    }

    dispose(): void {
        // default implementation does nothing.
    }
}
