import { Observable, map, merge } from 'rxjs';
import * as Chess from '../engine/ChessElements';
import { PlayerBase } from './PlayerBase';

export class GameSession {

    public movePlayed$: Observable<Chess.GameMove> = null;
    public evaluationProgress$: Observable<number> = null;

    public board: Chess.Board;

    public whitePlayer: PlayerBase;
    public blackPlayer: PlayerBase;

    public moveHistory: Chess.GameMove[];

    private isPaused: boolean;

    constructor() {
        this.isPaused = true;
    }

    public get activePlayer(): PlayerBase {
        return this.board.isWhiteToMove ? this.whitePlayer : this.blackPlayer;
    }

    public get inactivePlayer(): PlayerBase {
        return !this.board.isWhiteToMove ? this.whitePlayer : this.blackPlayer;
    }

    public dispose(): void {
        this.whitePlayer.dispose();
        this.blackPlayer.dispose();
        this.moveHistory = null;
    }

    public resume(): void {
        if (!this.isPaused) {
            throw "Can't resume - game is not paused.";
        }
        this.isPaused = false;
        this.activePlayer.activate(this.board);
    }

    public onSquareSelected(selectedSquare: Chess.BoardSquare) {
        this.activePlayer.onSquareSelected(selectedSquare);
    }

    public static createGame(whitePlayer: PlayerBase, blackPlayer: PlayerBase, board: Chess.Board): GameSession {

        let newGame = new GameSession();
        newGame.whitePlayer = whitePlayer;
        newGame.blackPlayer = blackPlayer;
        newGame.board = board;

        newGame.movePlayed$ = merge(whitePlayer.move$, blackPlayer.move$).pipe(map(newGame.onMove));
        newGame.evaluationProgress$ = merge(whitePlayer.progress$, blackPlayer.progress$);

        newGame.moveHistory = [];

        return newGame;
    }

    private onMove = (move: Chess.GameMove): Chess.GameMove => {

        if (!move) {
            alert("Game over!");
            return null;
        }

        let validatedMove = this.board.isLegalMove(move);
        if (!validatedMove) {
            alert("That move is not legal..");
            this.activePlayer.deactivate();
            this.activePlayer.activate(this.board);
            return null;
        }

        // Annotate the move with disambiguation information (this improves our move list display).
        validatedMove.disambiguationSquare = this.board.getMoveDisambiguationSquare(validatedMove);

        this.board = this.board.applyMove(validatedMove);

        validatedMove.checkHint = this.board.getCheckState();
        this.moveHistory.push(validatedMove);

        this.inactivePlayer.deactivate();
        this.activePlayer.activate(this.board);
        return validatedMove;
    }

    public static createStandardGame(whitePlayer: PlayerBase, blackPlayer: PlayerBase): GameSession {

        const standardBoard = Chess.Board.create([{ square: "a1", piece: Chess.PieceType.Rook },
        { square: "b1", piece: Chess.PieceType.Knight },
        { square: "c1", piece: Chess.PieceType.Bishop },
        { square: "d1", piece: Chess.PieceType.Queen },
        { square: "e1", piece: Chess.PieceType.King },
        { square: "f1", piece: Chess.PieceType.Bishop },
        { square: "g1", piece: Chess.PieceType.Knight },
        { square: "h1", piece: Chess.PieceType.Rook },
        { square: "a2", piece: Chess.PieceType.Pawn },
        { square: "b2", piece: Chess.PieceType.Pawn },
        { square: "c2", piece: Chess.PieceType.Pawn },
        { square: "d2", piece: Chess.PieceType.Pawn },
        { square: "e2", piece: Chess.PieceType.Pawn },
        { square: "f2", piece: Chess.PieceType.Pawn },
        { square: "g2", piece: Chess.PieceType.Pawn },
        { square: "h2", piece: Chess.PieceType.Pawn },
        ],
            [{ square: "a8", piece: Chess.PieceType.Rook },
            { square: "b8", piece: Chess.PieceType.Knight },
            { square: "c8", piece: Chess.PieceType.Bishop },
            { square: "d8", piece: Chess.PieceType.Queen },
            { square: "e8", piece: Chess.PieceType.King },
            { square: "f8", piece: Chess.PieceType.Bishop },
            { square: "g8", piece: Chess.PieceType.Knight },
            { square: "h8", piece: Chess.PieceType.Rook },
            { square: "a7", piece: Chess.PieceType.Pawn },
            { square: "b7", piece: Chess.PieceType.Pawn },
            { square: "c7", piece: Chess.PieceType.Pawn },
            { square: "d7", piece: Chess.PieceType.Pawn },
            { square: "e7", piece: Chess.PieceType.Pawn },
            { square: "f7", piece: Chess.PieceType.Pawn },
            { square: "g7", piece: Chess.PieceType.Pawn },
            { square: "h7", piece: Chess.PieceType.Pawn }],
            true, Chess.CastlingPotential.BlackKingside + Chess.CastlingPotential.BlackQueenside + Chess.CastlingPotential.WhiteKingside + Chess.CastlingPotential.WhiteQueenside);

        return GameSession.createGame(whitePlayer, blackPlayer, standardBoard);
    }

    public static createCustomGame(whitePlayer: PlayerBase, blackPlayer: PlayerBase): GameSession {

        const standardBoard = Chess.Board.create([{ square: "a6", piece: Chess.PieceType.Rook },
        { square: "f7", piece: Chess.PieceType.King },
        ],
            [{ square: "h8", piece: Chess.PieceType.King },
            { square: "h3", piece: Chess.PieceType.Pawn }],
            true, Chess.CastlingPotential.BlackKingside + Chess.CastlingPotential.BlackQueenside + Chess.CastlingPotential.WhiteKingside + Chess.CastlingPotential.WhiteQueenside);

        return GameSession.createGame(whitePlayer, blackPlayer, standardBoard);
    }
}