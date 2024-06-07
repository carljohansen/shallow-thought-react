import * as Chess from './ChessElements';
import GameHelper from "./GameHelper";

test('reads pieces from FEN', () => {

    Chess.BoardResources.init();

    //const testFen = 'RNbQk3/PP2PP2/8/7B b qK -';
    const testFen = "r1bq2r1/b4pk1/p1pp1p2/1p2pP2/1P2P1PB/3P4/1PPQ2P1/R3K2R w";
    
    const [actualPiecesWhite, actualEndPos] = GameHelper.readPieces(testFen, 0, Chess.Player.White);
    const [actualPiecesBlack, actualEndPos2] = GameHelper.readPieces(testFen, 0, Chess.Player.Black);

    const actualBoard = GameHelper.createBoardFromFen(testFen);

    expect(actualBoard.castlingStatus).toBe(Chess.CastlingPotential.BlackKingside
        | Chess.CastlingPotential.BlackQueenside
        | Chess.CastlingPotential.WhiteKingside
        | Chess.CastlingPotential.WhiteQueenside);
});