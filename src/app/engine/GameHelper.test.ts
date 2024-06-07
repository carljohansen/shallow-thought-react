import * as Chess from './ChessElements';
import GameHelper from "./GameHelper";

test('reads pieces from FEN', () => {

    Chess.BoardResources.init();

    const testFen = 'RNbQk3/PP2PP2/8/7B b -';
    const [actualPiecesWhite, actualEndPos] = GameHelper.readPieces(testFen, 0, Chess.Player.White);
    const [actualPiecesBlack, actualEndPos2] = GameHelper.readPieces(testFen, 0, Chess.Player.Black);

    const actualBoard = GameHelper.createBoardFromFen(testFen);

    expect(actualPiecesWhite.length).toBe(8);
});