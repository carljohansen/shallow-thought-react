export {}
// import { Subject } from 'rxjs';
// import * as Chess from './app/engine/ChessElements'

// export abstract class PlayerBase {

//     //   @Output() move: EventEmitter<Chess.GameMove> = new EventEmitter();
//     //   @Output() progress: EventEmitter<number> = new EventEmitter();
//     public move$ = new Subject<Chess.GameMove>();
//     public progress$ = new Subject<number>();

//     //constructor(colour: Chess.Player) {    }

//     abstract activate(board: Chess.Board): void;
//     abstract deactivate(): void;

//     onSquareSelected(square: Square) {
//         // default implementation does nothing.
//     }

//     dispose(): void {
//         // default implementation does nothing.
//     }
// }

// class SquareComponent {} // This is here just to shut up the errors.

// export class HumanPlayer extends PlayerBase {

//     isActive: boolean;

//     private selectedFromSquare: SquareComponent;

//     constructor(colour: Chess.Player) {
//         //super(colour);
//         super();
//         this.isActive = false;
//     }

//     activate(board: Chess.Board): void {
//         if (!this.isActive) {
//             this.isActive = true;
//         }
//     }

//     onSquareSelected(square: SquareComponent) {
//         if (!this.isActive) {
//             return;
//         }

//         if (!this.selectedFromSquare) {
//             // Nothing currently selected so we're choosing a source square.
//             this.selectedFromSquare = square;
//             this.selectedFromSquare.select();
//             return;
//         }

//         if (this.selectedFromSquare.algebraicName === square.algebraicName) {
//             // User is re-selecting the from square; we call that a cancellation.
//             this.selectedFromSquare.deselect();
//             this.selectedFromSquare = null;
//             return;
//         }

//         // We have a move!
//         const toSquare = square;
//         this.move$.next({ fromSquare: this.selectedFromSquare.square, toSquare: toSquare.square });
//     }

//     public deactivate(): void {
//         if (this.selectedFromSquare) {
//             this.selectedFromSquare.deselect();
//             this.selectedFromSquare = null;
//         }
//     }
// }

// export class ArtificialPlayer extends PlayerBase {

//     private currentBoard: Chess.Board;
//     private engineWorker: Worker;
//     private playedMove: Chess.GameMove;

//     constructor(colour: Chess.Player) {
//         //super(colour);
//         super();
//         this.engineWorker = undefined;
//     }

//     activate(board: Chess.Board): void {

//         if (!this.engineWorker) {
//             this.engineWorker = new Worker("/engine.bundle.js");
//             this.engineWorker.onmessage = this.onMoveDecision;
//         }
//         this.progress$.next(0);
//         this.currentBoard = board;
//         this.engineWorker.postMessage(board);
//     }

//     public onMoveDecision = (e: MessageEvent) => {

//         var matchProgress = (data: any) => {
//             const myRegexp = /PROGRESS:(.+)/g;
//             var match = myRegexp.exec(data);
//             return match ? parseInt(match[1], 10) : null;
//         };

//         let progress: number;
//         if ((progress = matchProgress(e.data)) !== null) {
//             this.progress$.next(progress);
//             return;
//         }

//         const chosenMoveAsObj = e.data;
//         if (!chosenMoveAsObj) {
//             // We are unable to move.  It's either mate or stalemate.
//             this.move$.next(null);
//         } else {
//             this.playedMove = Chess.GameMove.deserialize(e.data);
//             this.move$.next(this.playedMove);
//         }
//     }

//     public deactivate(): void {
//         this.currentBoard = null;
//         this.playedMove = null;
//     }

//     public dispose(): void {
//         if (this.engineWorker) {
//             this.engineWorker.terminate();
//             this.engineWorker = undefined;
//         }
//     }
// }