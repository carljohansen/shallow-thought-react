import * as Chess from './ChessElements';

interface ISquareOccupation {
    square: string,
    piece: Chess.PieceType
}

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

    public static createBoardFromFen(boardFen: string): Chess.Board {

        const [whitePieces, endPos] = this.readPieces(boardFen, 0, Chess.Player.White);
        const [blackPieces] = this.readPieces(boardFen, 0, Chess.Player.Black);

        const [nextMover, moverEndPos] = this.readNextMover(boardFen, endPos);

        const isWhiteToMove = nextMover === Chess.Player.White;
        return Chess.Board.create(whitePieces, blackPieces, isWhiteToMove, 0);
    }

    public static readPieces(boardFen: string, startPos: number, player: Chess.Player): [occupiedSquares: ISquareOccupation[], endPos: number] {

        const occupiedSquares: ISquareOccupation[] = [];
        let currPos = startPos;
        let currRank = 8;
        let currFile = 1;
        const expectedRook = player === Chess.Player.White ? 'R' : 'r';
        const expectedKnight = player === Chess.Player.White ? 'N' : 'n';
        const expectedBishop = player === Chess.Player.White ? 'B' : 'b';
        const expectedQueen = player === Chess.Player.White ? 'Q' : 'q';
        const expectedKing = player === Chess.Player.White ? 'K' : 'k';
        const expectedPawn = player === Chess.Player.White ? 'P' : 'p';
        while (true) {
            const currChar = boardFen[currPos];
            if (currChar === ' ') {
                break;
            }
            if (currChar >= '1' && currChar <= '8') {
                const squareJump = parseInt(currChar);
                currFile += squareJump;
            } else {
                let currPiece: Chess.PieceType = null;
                switch (currChar) {
                    case expectedRook:
                        currPiece = Chess.PieceType.Rook;
                        break;
                    case expectedKnight:
                        currPiece = Chess.PieceType.Knight;
                        break;
                    case expectedBishop:
                        currPiece = Chess.PieceType.Bishop;
                        break;
                    case expectedQueen:
                        currPiece = Chess.PieceType.Queen;
                        break;
                    case expectedKing:
                        currPiece = Chess.PieceType.King;
                        break;
                    case expectedPawn:
                        currPiece = Chess.PieceType.Pawn;
                        break;
                    case '/':
                        currFile = 0;
                        currRank--;
                        break;
                    default:
                        // Presumably this is a piece belonging to the other side;
                        break;
                }
                if (currPiece) {
                    const currFileLetter = String.fromCharCode(96 + currFile);
                    const currSquareName = `${currFileLetter}${currRank}`;
                    occupiedSquares.push({ square: currSquareName, piece: currPiece });
                }
                currFile++;
            }
            currPos++;
        }

        return [occupiedSquares, currPos];
    }

    private static readNextMover(boardFen: string, startPos: number): [nextMover: Chess.Player, endPos: number] {
        let currPos = startPos;
        while (boardFen[currPos] === ' ') {
            currPos++;
        }
        return [(boardFen[currPos] === 'w' ? Chess.Player.White : Chess.Player.Black), currPos];
    }
}