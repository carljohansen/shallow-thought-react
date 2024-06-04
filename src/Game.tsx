import * as Chess from './app/engine/ChessElements'
import React, { FC, useState } from 'react';
import Square from './Square';
import { BoardSquare, GameMove } from './app/engine/ChessElements';
import Piece from './Piece';

export interface SquareSelectedEvent extends CustomEvent<BoardSquare> { }

export interface MoveSelectedEvent extends CustomEvent<GameMove> { }

interface GameProps {
    gameBoard: Chess.Board,
    newMove?: Chess.GameMove,
    handleMoveInput: (e: MoveSelectedEvent) => void
}

const Game: FC<GameProps> = ({ gameBoard, handleMoveInput, newMove = null }) => {

    const [selectedFromSquare, setSelectedFromSquare] = useState<BoardSquare>(null);

    const onSquareSelected = (event: SquareSelectedEvent) => {
        const selectedSquare = event.detail;
        if (event.type === "squareSelected") {
            if (!!selectedFromSquare) {
                moveSelected(selectedFromSquare, selectedSquare);
            } else {
                setSelectedFromSquare(selectedSquare);
                console.log(`${event.detail.algebraicNotation}: ${event.type}.`);
            }
            return;
        }

        // De-selecting
        setSelectedFromSquare(null);
        console.log(`de-selected`);
    };

    const moveSelected = (fromSquare: BoardSquare, toSquare: BoardSquare) => {
        const validatedMove = gameBoard.isLegalMove({ fromSquare: fromSquare, toSquare: toSquare });
        if (!!validatedMove) {
            console.log(`move selected for human player: ${fromSquare.algebraicNotation} to ${toSquare.algebraicNotation}.`);
            console.log(validatedMove);
            handleMoveInput(new CustomEvent("humanMove", { detail: validatedMove }));
        } else {
            console.log("Invalid move!")
        }

        setSelectedFromSquare(null);
    }

    const squareDivs: JSX.Element[] = [];
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            const squareName = `${String.fromCharCode(97 + col)}${String(8 - row)}`
            const isSquareSelected = squareName === selectedFromSquare?.algebraicNotation;
            squareDivs.push(
                (<Square key={row * 8 + col}
                    isLight={(row % 2) === (col % 2)}
                    boardSquare={new BoardSquare(col + 1, 8 - row)}
                    isHighlighed={isSquareSelected}
                    handleClick={onSquareSelected} />)
            )
        }
    }

    const pieceElements: JSX.Element[] = [];
    gameBoard.forEachOccupiedSquare(os => pieceElements.push(
        <Piece key={os.square.index} occupiedSquare={os} />
    ));

    return (
        <div className="boardgrid">
            {squareDivs}
            {pieceElements}
        </div>
    )
}

// class Game2 extends React.Component {

//     constructor(props) {
//         super(props);

//         this.state = {
//             selectedFromSquare: ""
//         };
//     }

//     public get selectedFromSquare(): BoardSquare {
//         return this.state["selectedFromSquare"];
//     }

//     onSquareSelected = (event: SquareSelectedEvent) => {
//         const selectedSquare = event.detail;
//         if (event.type === "squareSelected") {
//             if (!!this.selectedFromSquare) {
//                 this.moveSelected(this.selectedFromSquare, selectedSquare);
//             } else {
//                 this.setState({ ...this.state, selectedFromSquare: selectedSquare });
//                 console.log(`${event.detail.algebraicNotation}: ${event.type}.`);
//             }
//             return;
//         }

//         // De-selecting
//         this.setState({ ...this.state, selectedFromSquare: "" });
//         console.log(`de-selected`);
//     };

//     moveSelected(fromSquare: BoardSquare, toSquare: BoardSquare) {
//         console.log(`move selected for human player: ${fromSquare.algebraicNotation} to ${toSquare.algebraicNotation}.`);
//         this.setState({ ...this.state, selectedFromSquare: "" });
//     }

//     render() {
//         const squareDivs: JSX.Element[] = [];
//         for (var row = 0; row < 8; row++) {
//             for (var col = 0; col < 8; col++) {
//                 const squareName = `${String.fromCharCode(97 + col)}${String(8 - row)}`
//                 const isSquareSelected = squareName === this.selectedFromSquare.algebraicNotation;
//                 squareDivs.push(
//                     (<Square isLight={(row % 2) === (col % 2)}
//                         boardSquare={new BoardSquare(col + 1, 8 - row)}
//                         isHighlighed={isSquareSelected}
//                         handleClick={this.onSquareSelected} />)
//                 )
//             }
//         }

//         return (
//             <div className="boardgrid">
//                 {squareDivs}
//             </div>
//         )
//     }
// }

// interface GameProps { game?: any }

// // const GameF: FC<GameProps> = ({ game }) => {

// //     const squareDivs: JSX.Element[] = [];
// //     for (var row = 0; row < 8; row++) {
// //         for (var col = 0; col < 8; col++) {
// //             squareDivs.push(
// //                 (<Square isLight={(row % 2) === (col % 2)} />)
// //             )
// //         }
// //     }

// //     return (
// //         <div className="boardgrid">
// //             {squareDivs}
// //         </div>
// //     )
// // }

// class Game extends React.Component {

//     //@Output() movePlayed: EventEmitter<any> = new EventEmitter();
//     //@Output() progressNotified: EventEmitter<number> = new EventEmitter();

//     public board: Chess.Board;

//     public whitePlayer: PlayerBase;
//     public blackPlayer: PlayerBase;

//     public moveHistory: Chess.GameMove[];

//     private isPaused: boolean;

//     constructor() {
//         super(null);
//         this.isPaused = true;
//     }

//     render() {
//         const squareDivs: JSX.Element[] = [];
//         for (var row = 0; row < 8; row++) {
//             for (var col = 0; col < 8; col++) {
//                 squareDivs.push(
//                     (<Square isLight={(row % 2) === (col % 2)} />)
//                 )
//             }
//         }

//         return (
//             <div className="boardgrid">
//                 {squareDivs}
//             </div>
//         )
//     }

//     public get activePlayer(): PlayerBase {
//         return this.board.isWhiteToMove ? this.whitePlayer : this.blackPlayer;
//     }

//     public get inactivePlayer(): PlayerBase {
//         return !this.board.isWhiteToMove ? this.whitePlayer : this.blackPlayer;
//     }

//     public dispose(): void {
//         this.whitePlayer.dispose();
//         this.blackPlayer.dispose();
//         this.moveHistory = null;
//     }

//     public resume(): void {
//         if (!this.isPaused) {
//             throw "Can't resume - game is not paused.";
//         }
//         this.isPaused = false;
//         this.activePlayer.activate(this.board);
//     }

//     // public onSquareSelected(selectedSquare: SquareComponent) {
//     //     this.activePlayer.onSquareSelected(selectedSquare);
//     // }

//     public static createGame(whitePlayer: PlayerBase, blackPlayer: PlayerBase, board: Chess.Board): Game {

//         let newGame = new Game();
//         newGame.whitePlayer = whitePlayer;
//         newGame.blackPlayer = blackPlayer;
//         newGame.board = board;

//         newGame.whitePlayer.move$.subscribe(newGame.onMove);
//         newGame.blackPlayer.move$.subscribe(newGame.onMove);
//         newGame.whitePlayer.progress$.subscribe(newGame.onProgressNotified);
//         newGame.blackPlayer.progress$.subscribe(newGame.onProgressNotified);

//         newGame.moveHistory = [];

//         return newGame;
//     }

//     private onMove = (move: Chess.GameMove) => {

//         if (!move) {
//             alert("Game over!");
//             return;
//         }

//         let validatedMove = this.board.isLegalMove(move);
//         if (!validatedMove) {
//             alert("That move is not legal..");
//             this.activePlayer.deactivate();
//             this.activePlayer.activate(this.board);
//             return;
//         }

//         // Annotate the move with disambiguation information (this improves our move list display).
//         validatedMove.disambiguationSquare = this.board.getMoveDisambiguationSquare(validatedMove);

//         this.board = this.board.applyMove(validatedMove);

//         validatedMove.checkHint = this.board.getCheckState();
//         this.moveHistory.push(validatedMove);

//         this.inactivePlayer.deactivate();
//         this.activePlayer.activate(this.board);
//        // this.movePlayed.emit(true);
//     }

//     private onProgressNotified = (progress: number) => {
//        // this.progressNotified.emit(progress);
//     }

//     public static createStandardGame(whitePlayer: PlayerBase, blackPlayer: PlayerBase): Game {

//         const standardBoard = Chess.Board.create([{ square: "a1", piece: Chess.PieceType.Rook },
//         { square: "b1", piece: Chess.PieceType.Knight },
//         { square: "c1", piece: Chess.PieceType.Bishop },
//         { square: "d1", piece: Chess.PieceType.Queen },
//         { square: "e1", piece: Chess.PieceType.King },
//         { square: "f1", piece: Chess.PieceType.Bishop },
//         { square: "g1", piece: Chess.PieceType.Knight },
//         { square: "h1", piece: Chess.PieceType.Rook },
//         { square: "a2", piece: Chess.PieceType.Pawn },
//         { square: "b2", piece: Chess.PieceType.Pawn },
//         { square: "c2", piece: Chess.PieceType.Pawn },
//         { square: "d2", piece: Chess.PieceType.Pawn },
//         { square: "e2", piece: Chess.PieceType.Pawn },
//         { square: "f2", piece: Chess.PieceType.Pawn },
//         { square: "g2", piece: Chess.PieceType.Pawn },
//         { square: "h2", piece: Chess.PieceType.Pawn },
//         ],
//             [{ square: "a8", piece: Chess.PieceType.Rook },
//             { square: "b8", piece: Chess.PieceType.Knight },
//             { square: "c8", piece: Chess.PieceType.Bishop },
//             { square: "d8", piece: Chess.PieceType.Queen },
//             { square: "e8", piece: Chess.PieceType.King },
//             { square: "f8", piece: Chess.PieceType.Bishop },
//             { square: "g8", piece: Chess.PieceType.Knight },
//             { square: "h8", piece: Chess.PieceType.Rook },
//             { square: "a7", piece: Chess.PieceType.Pawn },
//             { square: "b7", piece: Chess.PieceType.Pawn },
//             { square: "c7", piece: Chess.PieceType.Pawn },
//             { square: "d7", piece: Chess.PieceType.Pawn },
//             { square: "e7", piece: Chess.PieceType.Pawn },
//             { square: "f7", piece: Chess.PieceType.Pawn },
//             { square: "g7", piece: Chess.PieceType.Pawn },
//             { square: "h7", piece: Chess.PieceType.Pawn }],
//             true, Chess.CastlingPotential.BlackKingside + Chess.CastlingPotential.BlackQueenside + Chess.CastlingPotential.WhiteKingside + Chess.CastlingPotential.WhiteQueenside);

//         return Game.createGame(whitePlayer, blackPlayer, standardBoard);
//     }

//     public static createCustomGame(whitePlayer: PlayerBase, blackPlayer: PlayerBase): Game {

//         const standardBoard = Chess.Board.create([{ square: "a6", piece: Chess.PieceType.Rook },
//         { square: "f7", piece: Chess.PieceType.King },
//         ],
//             [{ square: "h8", piece: Chess.PieceType.King },
//             { square: "h3", piece: Chess.PieceType.Pawn }],
//             true, Chess.CastlingPotential.BlackKingside + Chess.CastlingPotential.BlackQueenside + Chess.CastlingPotential.WhiteKingside + Chess.CastlingPotential.WhiteQueenside);

//         return Game.createGame(whitePlayer, blackPlayer, standardBoard);
//     }
// }

export default Game;