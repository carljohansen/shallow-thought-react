import * as Chess from './ChessElements';

export default class GameHelper {
    public static createStandardBoard() {
        return Chess.Board.create([{ square: "a1", piece: Chess.PieceType.Rook },
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

    }
}