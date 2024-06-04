import * as Chess from './ChessElements';
 
export default class MoveGenerator {

    private static knightVectors = [[-2, -1], [-2, 1], [2, -1], [2, 1],
    [-1, -2], [1, -2], [-1, 2], [1, 2]];

    private static rookVectors = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    private static bishopVectors = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    public static getPotentialKnightMoves(board: Chess.Board, fromSquare: Chess.BoardSquare, findKingCaptureOnly?: boolean): Chess.GameMove[] {
        let result: Chess.GameMove[] = [];
        const opponentColour = board.isWhiteToMove ? Chess.Player.Black : Chess.Player.White;
        for (let i = 0; i < 8; i++) {
            const currVector = MoveGenerator.knightVectors[i];
            const newRank = fromSquare.rank + currVector[0];
            const newFile = fromSquare.file + currVector[1];
            if (Chess.BoardResources.isValidSquare(newFile, newRank)) {
                var destSquare = board.getSquarePiece(newFile, newRank);
                const capturePiece = destSquare.piece;
                if (capturePiece === Chess.PieceType.None
                    || destSquare.player === opponentColour) {

                    if (findKingCaptureOnly && (capturePiece === Chess.PieceType.King)) {
                        return []; // Non-null indicates king capture exists.
                    }
                    result.push({
                        fromSquare: fromSquare, toSquare: Chess.BoardResources.byFileAndRank(newFile, newRank),
                        isCapture: capturePiece !== Chess.PieceType.None,
                        piece: Chess.PieceType.Knight,
                        isTheoreticalKingCapture: destSquare.piece === Chess.PieceType.King
                    });
                }
            }
        }
        if (findKingCaptureOnly) {
            return null;
        }
        return result;
    }

    public static getPotentialPawnMoves(board: Chess.Board, fromSquare: Chess.BoardSquare, includeSquareAttacks: boolean, findKingCaptureOnly?: boolean): Chess.GameMove[] {
        let result: Chess.GameMove[] = [];
        const opponentColour = board.isWhiteToMove ? Chess.Player.Black : Chess.Player.White;
        const direction = board.isWhiteToMove ? 1 : -1;
        // 1. Captures.
        for (let i = -1; i <= 1; i += 2) {
            let newRank = fromSquare.rank + direction;
            const newFile = fromSquare.file + i;
            if (Chess.BoardResources.isValidSquare(newFile, newRank)) {
                var destSquare = board.getSquarePiece(newFile, newRank);
                let capturePiece = destSquare.piece;
                if (!findKingCaptureOnly
                    && capturePiece === Chess.PieceType.None
                    && newFile === board.enPassantActiveFile) {
                    const epCaptureFromRank = board.isWhiteToMove ? 5 : 4;
                    if (fromSquare.rank === epCaptureFromRank) {
                        // An en-passant capture is possible.
                        newRank = board.isWhiteToMove ? 6 : 3;
                        destSquare.player = opponentColour;
                        capturePiece = Chess.PieceType.Pawn;
                    }
                }
                if (capturePiece !== Chess.PieceType.None
                    && destSquare.player === opponentColour) {

                    if (findKingCaptureOnly && (capturePiece === Chess.PieceType.King)) {
                        return []; // Non-null indicates king capture exists.
                    }
                    result.push({
                        fromSquare: fromSquare, toSquare: Chess.BoardResources.byFileAndRank(newFile, newRank),
                        isCapture: true,
                        isTheoreticalKingCapture: capturePiece === Chess.PieceType.King
                    });
                } else if (includeSquareAttacks && capturePiece === Chess.PieceType.None) {
                    result.push({
                        fromSquare: fromSquare, toSquare: Chess.BoardResources.byFileAndRank(newFile, newRank),
                        isPawnAttack: true
                    });
                }
            }
        }

        if (findKingCaptureOnly) {
            return null;
        }

        const potentialTwoPush = (board.isWhiteToMove && fromSquare.rank === 2) || (!board.isWhiteToMove && fromSquare.rank === 7);

        // 2. Pushes.
        for (let i = 1; i <= 2; i++) {
            const newRank = fromSquare.rank + direction * i;
            const newFile = fromSquare.file;
            if (Chess.BoardResources.isValidSquare(newFile, newRank)) {
                var destSquare = board.getSquarePiece(newFile, newRank);
                const blockingPiece = destSquare.piece;
                if (blockingPiece !== Chess.PieceType.None) {
                    break;
                }
                result.push({
                    fromSquare: fromSquare,
                    toSquare: Chess.BoardResources.byFileAndRank(newFile, newRank),
                    sideEffect: (i === 2) ? Chess.MoveSideEffect.EnablesEnPassantCapture : Chess.MoveSideEffect.None
                });

            }
            if (!potentialTwoPush) {
                break;
            }
        }

        const promotionRank = board.isWhiteToMove ? 8 : 1;
        for (let i = 0; i < result.length; i++) {
            if (result[i].toSquare.rank === promotionRank) {
                result[i].sideEffect = Chess.MoveSideEffect.PromoteToQueen;
            }
        }
        return result;
    }

    public static getPotentialKingMoves(board: Chess.Board, fromSquare: Chess.BoardSquare, findKingCaptureOnly?: boolean): Chess.GameMove[] {
        let result: Chess.GameMove[] = [];
        const opponentColour = board.isWhiteToMove ? Chess.Player.Black : Chess.Player.White;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                const newRank = fromSquare.rank + i;
                const newFile = fromSquare.file + j;
                if (Chess.BoardResources.isValidSquare(newFile, newRank)) {
                    var destSquare = board.getSquarePiece(newFile, newRank);
                    const capturePiece = destSquare.piece;
                    if (capturePiece === Chess.PieceType.None
                        || destSquare.player === opponentColour) {

                        if (findKingCaptureOnly && (capturePiece === Chess.PieceType.King)) {
                            return []; // Non-null indicates king capture exists.
                        }

                        result.push({
                            fromSquare: fromSquare, toSquare: Chess.BoardResources.byFileAndRank(newFile, newRank),
                            piece: Chess.PieceType.King,
                            isCapture: capturePiece !== Chess.PieceType.None,
                            isTheoreticalKingCapture: capturePiece === Chess.PieceType.King,
                            sideEffect: Chess.MoveSideEffect.NullifiesKingsideCastling | Chess.MoveSideEffect.NullifiesQueensideCastling
                        });
                    }
                }
            }
        }

        if (findKingCaptureOnly) {
            return null;
        }

        // Deal with castling.
        const potentialKingside = (board.isWhiteToMove && (board.castlingStatus & Chess.CastlingPotential.WhiteKingside))
            || (!board.isWhiteToMove && (board.castlingStatus & Chess.CastlingPotential.BlackKingside));
        const potentialQueenside = (board.isWhiteToMove && (board.castlingStatus & Chess.CastlingPotential.WhiteQueenside))
            || (!board.isWhiteToMove && (board.castlingStatus & Chess.CastlingPotential.BlackQueenside));

        if (potentialKingside || potentialQueenside) {
            let potentialCastlingMoveFiles = [];
            let castlingRank = board.isWhiteToMove ? 1 : 8;
            if (potentialKingside) {
                // We're told that white can potentially castle kingside, so we assume king and rook are on the right squares!
                potentialCastlingMoveFiles.push([6, 7, 0]);
            }
            if (potentialQueenside) {
                potentialCastlingMoveFiles.push([4, 3, 2]);
            }
            let currentCheckState = 0;  // 0=unknown, 1=currently in check, 2 = all good.
            for (let i = 0; i < potentialCastlingMoveFiles.length; i++) {
                const transitFile = potentialCastlingMoveFiles[i][0];
                const destFile = potentialCastlingMoveFiles[i][1];
                const rookTransitFile = potentialCastlingMoveFiles[i][2];
                if (board.getSquarePiece(transitFile, castlingRank).piece === Chess.PieceType.None
                    && board.getSquarePiece(destFile, castlingRank).piece === Chess.PieceType.None
                    && (rookTransitFile === 0 || board.getSquarePiece(rookTransitFile, castlingRank).piece === Chess.PieceType.None)) {

                    if (currentCheckState === 0) {
                        // Make sure we're not in check.
                        board.isWhiteToMove = !board.isWhiteToMove;
                        let isInCheck = board.playerHasTheoreticalKingCapture();
                        board.isWhiteToMove = !board.isWhiteToMove;
                        if (isInCheck) {
                            currentCheckState = 1;
                        } else {
                            currentCheckState = 2;
                        }
                    }
                    if (currentCheckState === 2) {
                        let transitCheckMove: Chess.GameMove = { fromSquare: fromSquare, toSquare: Chess.BoardResources.byFileAndRank(transitFile, castlingRank) };
                        let transitCheckBoard = board.applyMove(transitCheckMove);
                        if (!transitCheckBoard.playerHasTheoreticalKingCapture()) {
                            result.push({
                                fromSquare: fromSquare, toSquare: Chess.BoardResources.byFileAndRank(destFile, castlingRank)
                            });
                        }
                    }
                }
            }
        }
        return result;
    }

    public static getPotentialRookMoves(board: Chess.Board, fromSquare: Chess.BoardSquare, inRookContext: boolean, findKingCaptureOnly?: boolean): Chess.GameMove[] {

        let castlingEffect = Chess.MoveSideEffect.None;
        if (inRookContext) {
            // We really are a rook (not a queen) so we can affect the castling status.
            if (fromSquare.file === 8) {
                castlingEffect = Chess.MoveSideEffect.NullifiesKingsideCastling;
            } else if (fromSquare.file === 1) {
                castlingEffect = Chess.MoveSideEffect.NullifiesQueensideCastling;
            }
        }

        let result: Chess.GameMove[] = [];
        const opponentColour = board.isWhiteToMove ? Chess.Player.Black : Chess.Player.White;
        for (let i = 0; i < 4; i++) {
            for (let j = 1; j <= 7; j++) {
                const currVector = MoveGenerator.rookVectors[i];
                const newRank = fromSquare.rank + currVector[0] * j;
                const newFile = fromSquare.file + currVector[1] * j;
                if (!Chess.BoardResources.isValidSquare(newFile, newRank)) {
                    break;
                }
                var destSquare = board.getSquarePiece(newFile, newRank);
                const capturePiece = destSquare.piece;
                if (capturePiece === Chess.PieceType.None
                    || destSquare.player === opponentColour) {

                    if (findKingCaptureOnly && (capturePiece === Chess.PieceType.King)) {
                        return []; // Non-null indicates king capture exists.
                    }

                    result.push({
                        fromSquare: fromSquare, toSquare: Chess.BoardResources.byFileAndRank(newFile, newRank),
                        isCapture: capturePiece !== Chess.PieceType.None,
                        piece: inRookContext ? Chess.PieceType.Rook : Chess.PieceType.Queen,
                        isTheoreticalKingCapture: destSquare.piece === Chess.PieceType.King,
                        sideEffect: castlingEffect
                    });
                }
                if (capturePiece !== Chess.PieceType.None) {
                    break; // the way is blocked.
                }
            }
        }
        if (findKingCaptureOnly) {
            return null;
        }
        return result;
    }

    public static getPotentialBishopMoves(board: Chess.Board, fromSquare: Chess.BoardSquare, inBishopContext: boolean, findKingCaptureOnly?: boolean): Chess.GameMove[] {
        let result: Chess.GameMove[] = [];
        const opponentColour = board.isWhiteToMove ? Chess.Player.Black : Chess.Player.White;
        for (let i = 0; i < 4; i++) {
            for (let j = 1; j <= 7; j++) {
                const currVector = MoveGenerator.bishopVectors[i];
                const newRank = fromSquare.rank + currVector[0] * j;
                const newFile = fromSquare.file + currVector[1] * j;
                if (!Chess.BoardResources.isValidSquare(newFile, newRank)) {
                    break;
                }
                var destSquare = board.getSquarePiece(newFile, newRank);
                const capturePiece = destSquare.piece;
                if (capturePiece === Chess.PieceType.None
                    || destSquare.player === opponentColour) {

                    if (findKingCaptureOnly && (capturePiece === Chess.PieceType.King)) {
                        return []; // Non-null indicates king capture exists.
                    }
                    result.push({
                        fromSquare: fromSquare, toSquare: Chess.BoardResources.byFileAndRank(newFile, newRank),
                        piece: inBishopContext ? Chess.PieceType.Bishop : Chess.PieceType.Queen,
                        isCapture: capturePiece !== Chess.PieceType.None,
                        isTheoreticalKingCapture: destSquare.piece === Chess.PieceType.King
                    });
                }
                if (capturePiece !== Chess.PieceType.None) {
                    break; // the way is blocked.
                }
            }
        }
        if (findKingCaptureOnly) {
            return null;
        }
        return result;
    }

    public static getPotentialQueenMoves(board: Chess.Board, fromSquare: Chess.BoardSquare, findKingCaptureOnly?: boolean): Chess.GameMove[] {

        if (findKingCaptureOnly) {
            if (MoveGenerator.getPotentialBishopMoves(board, fromSquare, false, true) !== null) {
                return [];
            }
            if (MoveGenerator.getPotentialRookMoves(board, fromSquare, false, true) !== null) {
                return [];
            }
            return null;
        }

        return MoveGenerator.getPotentialRookMoves(board, fromSquare, false).concat(
            MoveGenerator.getPotentialBishopMoves(board, fromSquare, false)
        );
    }
}