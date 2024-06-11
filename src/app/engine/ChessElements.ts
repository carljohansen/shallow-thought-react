import * as Chess from './ChessElements';
import MoveGenerator from './MoveGenerator';

export class BoardSquare {

    private squareIndex: number;
    private algebName: string;
    public readonly screenRank: number;
    public readonly screenFile: number;

    constructor(public readonly file: number, public readonly rank: number, orientation: Chess.Player = Chess.Player.White) {
        this.squareIndex = ((this.rank - 1) * 8) + (this.file - 1);
        this.algebName = String.fromCharCode(96 + this.file) + this.rank;
        if (orientation === Chess.Player.White) {
            this.screenFile = file;
            this.screenRank = rank;
        } else {
            this.screenFile = 9 - file;
            this.screenRank = 9 - rank;
        }
    }

    public get algebraicNotation(): string {
        return this.algebName;
    }

    public get index(): number {
        return this.squareIndex;
    }
}

export enum PieceType {
    None = 0,
    Pawn = 1,
    Knight = 2,
    Bishop = 3,
    Rook = 4,
    Queen = 5,
    King = 6
}

export enum MoveSideEffect {
    None = 0,
    PromoteToQueen = 1,
    NullifiesKingsideCastling = 2,
    NullifiesQueensideCastling = 4,
    EnablesEnPassantCapture = 8
}

export enum CastlingPotential {
    None = 0,
    WhiteKingside = 1,
    WhiteQueenside = 2,
    BlackKingside = 4,
    BlackQueenside = 8
}

export interface MoveAnimationDefinition {
    fromSquareIndex: number;
    toSquareIndex: number;
    movingPiece: ColouredPiece;
    capturedPiece?: ColouredPiece;
    captureSquareIndex?: number; // useful in en-passant, if null then just use toSquareIndex.
    finalPiece?: ColouredPiece; // useful in promotion, if null then just use movingPiece.
    castlingType: CastlingPotential // zero for non-castling moves.  If non-zero then ignore all other properties.
}

export class BoardResources {

    public static squares: BoardSquare[];
    public static flippedSquares: BoardSquare[];
    public static pieces: ColouredPiece[];
    public static squaresGrid: BoardSquare[][];
    public static squaresGridUiLayout: BoardSquare[][];

    public static init(): void {

        if (BoardResources.squares) {
            return;
        }

        BoardResources.squares = [];
        BoardResources.flippedSquares = [];
        BoardResources.squaresGrid = [];
        BoardResources.squaresGridUiLayout = [];
        BoardResources.pieces = [];

        let squareIndex = 0;
        for (let rank = 1; rank <= 8; rank++) {
            BoardResources.squaresGridUiLayout[8 - rank] = [];
            for (let file = 1; file <= 8; file++) {
                const newSquare = new BoardSquare(file, rank);
                BoardResources.squares[squareIndex] = newSquare;
                BoardResources.flippedSquares[squareIndex++] = new BoardSquare(file, rank, Chess.Player.Black);
                if (rank === 1) {
                    BoardResources.squaresGrid[file] = [];
                }
                BoardResources.squaresGrid[file][rank] = newSquare;
                BoardResources.squaresGridUiLayout[8 - rank][file - 1] = newSquare;
            }
        }

        let pieceIndex = 0;
        for (let colour = 0; colour < 2; colour++) {
            for (let piece = 0; piece < 7; piece++) {
                BoardResources.pieces[pieceIndex++] = { piece: piece, player: colour };
            }
        }
    }

    public static byIndex(index: number): BoardSquare {
        return BoardResources.squares[index];
    }

    public static byFileAndRank(file: number, rank: number): BoardSquare {
        return BoardResources.squaresGrid[file][rank];
    }

    public static byAlgebraic(squareName: string): BoardSquare {
        const file = squareName.charCodeAt(0) - 96;
        const rank = squareName.charCodeAt(1) - 48;
        const squareIndex = ((rank - 1) * 8) + (file - 1);
        return BoardResources.byIndex(squareIndex);
    }

    public static isValidSquare(file: number, rank: number): boolean {
        return (1 <= file
            && file <= 8
            && 1 <= rank
            && rank <= 8);
    }

    public static colouredPieceToPieceId(piece: ColouredPiece): number {
        return piece.player * 7 + piece.piece;
    }

    public static getCastlingAnimation(move: Chess.MoveAnimationDefinition, renderingSquareIndex: number): Chess.MoveAnimationDefinition {
        if (!move.castlingType) {
            return null;
        }
        switch (move.castlingType) {
            case Chess.CastlingPotential.WhiteQueenside:
                if (renderingSquareIndex === this.byAlgebraic("a1").index
                    || renderingSquareIndex === this.byAlgebraic("d1").index) {
                    return {
                        fromSquareIndex: renderingSquareIndex,
                        toSquareIndex: this.byAlgebraic("d1").index,
                        movingPiece: { piece: Chess.PieceType.Rook, player: Chess.Player.White },
                        castlingType: 0
                    };
                }
                if (renderingSquareIndex === this.byAlgebraic("e1").index
                    || renderingSquareIndex === this.byAlgebraic("c1").index) {
                    return {
                        fromSquareIndex: renderingSquareIndex,
                        toSquareIndex: this.byAlgebraic("c1").index,
                        movingPiece: { piece: Chess.PieceType.King, player: Chess.Player.White },
                        castlingType: 0
                    };
                }
                break;
            case Chess.CastlingPotential.WhiteKingside:
                if (renderingSquareIndex === this.byAlgebraic("h1").index
                    || renderingSquareIndex === this.byAlgebraic("f1").index) {
                    return {
                        fromSquareIndex: renderingSquareIndex,
                        toSquareIndex: this.byAlgebraic("f1").index,
                        movingPiece: { piece: Chess.PieceType.Rook, player: Chess.Player.White },
                        castlingType: 0
                    };
                }
                if (renderingSquareIndex === this.byAlgebraic("e1").index
                    || renderingSquareIndex === this.byAlgebraic("g1").index) {
                    return {
                        fromSquareIndex: renderingSquareIndex,
                        toSquareIndex: this.byAlgebraic("g1").index,
                        movingPiece: { piece: Chess.PieceType.King, player: Chess.Player.White },
                        castlingType: 0
                    };
                }
                break;
            case Chess.CastlingPotential.BlackQueenside:
                if (renderingSquareIndex === this.byAlgebraic("a8").index
                    || renderingSquareIndex === this.byAlgebraic("d8").index) {
                    return {
                        fromSquareIndex: renderingSquareIndex,
                        toSquareIndex: this.byAlgebraic("d8").index,
                        movingPiece: { piece: Chess.PieceType.Rook, player: Chess.Player.Black },
                        castlingType: 0
                    };
                }
                if (renderingSquareIndex === this.byAlgebraic("e8").index
                    || renderingSquareIndex === this.byAlgebraic("c8").index) {
                    return {
                        fromSquareIndex: renderingSquareIndex,
                        toSquareIndex: this.byAlgebraic("c8").index,
                        movingPiece: { piece: Chess.PieceType.King, player: Chess.Player.Black },
                        castlingType: 0
                    };
                }
                break;
            case Chess.CastlingPotential.BlackKingside:
                if (renderingSquareIndex === this.byAlgebraic("h8").index
                    || renderingSquareIndex === this.byAlgebraic("f8").index) {
                    return {
                        fromSquareIndex: renderingSquareIndex,
                        toSquareIndex: this.byAlgebraic("f8").index,
                        movingPiece: { piece: Chess.PieceType.Rook, player: Chess.Player.Black },
                        castlingType: 0
                    };
                }
                if (renderingSquareIndex === this.byAlgebraic("e8").index
                    || renderingSquareIndex === this.byAlgebraic("g8").index) {
                    return {
                        fromSquareIndex: renderingSquareIndex,
                        toSquareIndex: this.byAlgebraic("g8").index,
                        movingPiece: { piece: Chess.PieceType.King, player: Chess.Player.Black },
                        castlingType: 0
                    };
                }
                break;
        }

        return null;
    }
}

export enum Player {
    White = 0,
    Black = 1
}

export enum PlayerType {
    Human = 0,
    Engine = 1
}

export interface ColouredPiece {
    player: Player;
    piece: PieceType;
}

export enum CheckState {
    None = 0,
    Check = 1,
    Checkmate = 2,
    Stalemate = 3
}

export interface OccupiedSquare {
    square: BoardSquare;
    piece: ColouredPiece;
}

export class GameMove {

    private static pieceSymbols = ['ERROR', '', 'N', "B", "R", "Q", "K"];

    fromSquare: BoardSquare;
    toSquare: BoardSquare;
    piece?: PieceType; // If this is not present, it's a pawn move or castling.
    isCapture?: boolean;
    isTheoreticalKingCapture?: boolean;
    isPawnAttack?: boolean;
    sideEffect?: MoveSideEffect;
    checkHint?: CheckState;
    disambiguationSquare?: string;

    public static deserialize(serializedMove: any): GameMove {
        const fromSquare = new BoardSquare(serializedMove.fromSquare.file, serializedMove.fromSquare.rank);
        const toSquare = new BoardSquare(serializedMove.toSquare.file, serializedMove.toSquare.rank);
        return {
            fromSquare: fromSquare,
            toSquare: toSquare,
            piece: serializedMove.piece,
            isCapture: serializedMove.isCapture,
            isTheoreticalKingCapture: serializedMove.isTheoreticalKingCapture,
            sideEffect: serializedMove.sideEffect
        };
    }

    public static getNotation(move: GameMove): string {
        if (!move) {
            return ".."; // blank for when black moves first in a setup.
        }
        let checkSymbol = "";
        if (move.checkHint === CheckState.Check) {
            checkSymbol = "+";
        } else if (move.checkHint === CheckState.Checkmate) {
            checkSymbol = "#";
        }
        return GameMove.getNotationWithoutCheck(move) + checkSymbol;
    }

    private static getNotationWithoutCheck(move: GameMove): string {

        let disambiguationFile = "";

        let disambiguationSquare = move.disambiguationSquare || "";

        if (disambiguationSquare) {
            disambiguationFile = disambiguationSquare[0];
            const fromFile = move.fromSquare.algebraicNotation[0];
            const fromRank = move.fromSquare.algebraicNotation[1];
            if (disambiguationFile === fromFile) {
                disambiguationSquare = fromRank;
            } else {
                disambiguationSquare = fromFile;
            }
        }

        if (typeof (move.piece) !== "undefined") {
            const moveTypeSymbol = move.isCapture ? "\u00D7" : "";
            return `${GameMove.pieceSymbols[move.piece]}${disambiguationSquare}${moveTypeSymbol}${move.toSquare.algebraicNotation}`;
        }
        const promotionNotation = (move.sideEffect === MoveSideEffect.PromoteToQueen ? "/Q" : "");
        if (move.isCapture) {
            // Must be a pawn capture.
            return `${move.fromSquare.algebraicNotation[0]}\u00D7${move.toSquare.algebraicNotation}${promotionNotation}`;
        }
        if (move.fromSquare.file === move.toSquare.file) {
            // Must be a pawn push.
            return `${move.toSquare.algebraicNotation}${promotionNotation}`;
        }
        // Must be castling.
        if (move.toSquare.file > move.fromSquare.file) {
            return "O-O";
        }
        return "O-O-O";
    }
}

export class Board {

    public static emptySquare: ColouredPiece = { player: Player.White, piece: PieceType.None };

    public squares: number[];

    public isWhiteToMove: boolean;

    public getCurrentPlayer(): Chess.Player { return this.isWhiteToMove ? Chess.Player.White : Chess.Player.Black };

    public getNonCurrentPlayer(): Chess.Player { return this.isWhiteToMove ? Chess.Player.Black : Chess.Player.White };

    public castlingStatus: number;

    public enPassantActiveFile: number;

    public moveCount: number;

    public numPieces: number = 0;

    public newMoveAnimation: MoveAnimationDefinition;

    public static create(whitePieces: { square: string, piece: PieceType }[],
        blackPieces: { square: string, piece: PieceType }[],
        isWhiteToMove: boolean, castlingStatus: number) {

        const newBoard = new Board();
        newBoard.squares = [];
        const allPieces = [whitePieces, blackPieces];
        newBoard.numPieces = whitePieces.length + blackPieces.length;
        for (let colour = 0; colour < 2; colour++) {
            let currPieces = allPieces[colour];
            for (let i = 0; i < currPieces.length; i++) {
                const destSquare = BoardResources.byAlgebraic(currPieces[i].square).index;
                newBoard.squares[destSquare] = colour * 7 + currPieces[i].piece;
            }
        }
        newBoard.isWhiteToMove = isWhiteToMove;
        newBoard.castlingStatus = castlingStatus;
        newBoard.enPassantActiveFile = 0;
        newBoard.moveCount = 0;
        return newBoard;
    }

    public getSquarePiece(file: number, rank: number): ColouredPiece {
        return this.getSquarePieceByIndex((rank - 1) * 8 + file - 1);
    }

    public getSquarePieceByIndex(squareIndex: number): ColouredPiece {
        const pieceCode = this.squares[squareIndex];
        if (!pieceCode)
            return Board.emptySquare;
        return BoardResources.pieces[pieceCode];
    }

    public forEachOccupiedSquare(fn: (s: OccupiedSquare) => void, orientation: Chess.Player = Chess.Player.White) {
        this.squares.forEach((pieceId: number, squareId: number) => {
            if (pieceId) {
                fn({
                    square: orientation === Chess.Player.White ? BoardResources.squares[squareId] : BoardResources.flippedSquares[squareId],
                    piece: BoardResources.pieces[pieceId]
                });
            }
        });
    }

    public forEachOccupiedSquareBeforeAnimation(fn: (s: OccupiedSquare, animation: MoveAnimationDefinition) => void,
        orientation: Chess.Player = Chess.Player.White,
        newMoveAnimation: MoveAnimationDefinition) {

        if (!newMoveAnimation) {
            return this.forEachOccupiedSquare((os) => fn(os, null), orientation);
        }

        this.squares.forEach((pieceId: number, squareId: number) => {
            const resolvedAnimation = BoardResources.getCastlingAnimation(newMoveAnimation, squareId) ?? newMoveAnimation;
            if (squareId === resolvedAnimation.fromSquareIndex) {
                // Report the moving piece as being on its start square.
                const finalPiece = resolvedAnimation.finalPiece ? resolvedAnimation.finalPiece : resolvedAnimation.movingPiece;
                pieceId = BoardResources.colouredPieceToPieceId(finalPiece);
            }
            if (squareId === resolvedAnimation.toSquareIndex
                && !resolvedAnimation.captureSquareIndex) {
                // Report the dest square as being either empty or containing the piece that's about to be captured.
                pieceId = resolvedAnimation.capturedPiece ? BoardResources.colouredPieceToPieceId(resolvedAnimation.capturedPiece) : 0;
            }
            if (squareId === resolvedAnimation.toSquareIndex
                && resolvedAnimation.captureSquareIndex) {
                // In an e.p., report the dest square as being empty (which it is)
                // The actual capture square can simply be reported as containing the pawn that it indeed contains.
                pieceId = 0;
            }

            if (pieceId) {
                fn({
                    square: orientation === Chess.Player.White ? BoardResources.squares[squareId] : BoardResources.flippedSquares[squareId],
                    piece: BoardResources.pieces[pieceId],
                },
                    resolvedAnimation
                );
            }
        });
    }

    public getPotentialMoves(includePawnAttacks?: boolean): GameMove[] {
        let result: GameMove[] = [];
        const currPlayer = this.isWhiteToMove ? Player.White : Player.Black;
        this.forEachOccupiedSquare(occSquare => {
            var pieceMoves: GameMove[];
            if (occSquare.piece.player === currPlayer) {

                switch (occSquare.piece.piece) {
                    case PieceType.Knight:
                        pieceMoves = MoveGenerator.getPotentialKnightMoves(this, occSquare.square);
                        break;
                    case PieceType.Pawn:
                        pieceMoves = MoveGenerator.getPotentialPawnMoves(this, occSquare.square, includePawnAttacks, false);
                        break;
                    case PieceType.King:
                        pieceMoves = MoveGenerator.getPotentialKingMoves(this, occSquare.square);
                        break;
                    case PieceType.Queen:
                        pieceMoves = MoveGenerator.getPotentialQueenMoves(this, occSquare.square);
                        break;
                    case PieceType.Bishop:
                        pieceMoves = MoveGenerator.getPotentialBishopMoves(this, occSquare.square, true);
                        break;
                    case PieceType.Rook:
                        pieceMoves = MoveGenerator.getPotentialRookMoves(this, occSquare.square, true);
                        break;
                    default:
                        pieceMoves = [];
                }
                result = result.concat(pieceMoves);
            }
        });
        return result;
    }

    public playerIsInCheck(): boolean {
        this.isWhiteToMove = !this.isWhiteToMove;
        const result = this.playerHasTheoreticalKingCapture();
        this.isWhiteToMove = !this.isWhiteToMove;
        return result;
    }

    public playerHasTheoreticalKingCapture(): boolean {
        const currPlayer = this.isWhiteToMove ? Player.White : Player.Black;
        var hasKingCapture = false;
        this.forEachOccupiedSquare(occSquare => {
            if (!hasKingCapture && occSquare.piece.player === currPlayer) {

                switch (occSquare.piece.piece) {
                    case PieceType.Knight:
                        if (MoveGenerator.getPotentialKnightMoves(this, occSquare.square, true) !== null)
                            hasKingCapture = true;
                        break;
                    case PieceType.Pawn:
                        if (MoveGenerator.getPotentialPawnMoves(this, occSquare.square, false, true) !== null)
                            hasKingCapture = true;
                        break;
                    case PieceType.King:
                        if (MoveGenerator.getPotentialKingMoves(this, occSquare.square, true) !== null)
                            hasKingCapture = true;
                        break;
                    case PieceType.Queen:
                        if (MoveGenerator.getPotentialQueenMoves(this, occSquare.square, true) !== null)
                            hasKingCapture = true;
                        break;
                    case PieceType.Bishop:
                        if (MoveGenerator.getPotentialBishopMoves(this, occSquare.square, true, true) !== null)
                            hasKingCapture = true;
                        break;
                    case PieceType.Rook:
                        if (MoveGenerator.getPotentialRookMoves(this, occSquare.square, true, true) !== null)
                            hasKingCapture = true;
                        break;
                }
            }
        });
        return hasKingCapture;
    }

    public get occupiedSquares(): OccupiedSquare[] {
        let result: OccupiedSquare[] = [];
        this.forEachOccupiedSquare(piece => result.push(piece));
        return result;
    }

    public isLegalMove(move: GameMove): GameMove {

        if (move.isPawnAttack) {
            return null;
        }

        const playerMoves = this.getPotentialMoves();
        const matchingMove = playerMoves.find(checkMove => {
            return checkMove.fromSquare.algebraicNotation === move.fromSquare.algebraicNotation
                && checkMove.toSquare.algebraicNotation === move.toSquare.algebraicNotation
        });
        if (!matchingMove) {
            // Move is not even a valid chess move.
            return null;
        }
        // Make sure the move wouldn't leave the player in check.
        var tempBoard = this.applyMove(matchingMove);
        return tempBoard.playerHasTheoreticalKingCapture()
            ? null
            : matchingMove;
    }

    public applyMove(move: GameMove, calculateAnimations: boolean = false): Board {
        const newBoard = new Board();
        newBoard.squares = this.squares.slice();
        const fromIndex = move.fromSquare.index;
        const toIndex = move.toSquare.index;
        const movingPiece = newBoard.squares[fromIndex];

        newBoard.squares[fromIndex] = 0;
        newBoard.numPieces = this.numPieces - (move.isCapture ? 1 : 0);

        if (calculateAnimations) {
            // 99% of the time we want the plain old move of the piece from origin to dest.
            newBoard.newMoveAnimation = {
                fromSquareIndex: move.fromSquare.index,
                toSquareIndex: move.toSquare.index,
                movingPiece: {
                    piece: move.piece ?? Chess.PieceType.Pawn,
                    player: this.isWhiteToMove ? Chess.Player.White : Chess.Player.Black
                },
                castlingType: 0
            };
        }

        if (move.isCapture
            && this.enPassantActiveFile
            && !this.squares[toIndex]) {
            // We're capturing but the dest square is empty.  En passant is the only possible explanation.
            const epCapturedPawnRank = this.isWhiteToMove ? 5 : 4;
            const epCapturedPawnIndex = BoardResources.byFileAndRank(this.enPassantActiveFile, epCapturedPawnRank).index;
            newBoard.squares[epCapturedPawnIndex] = 0; // Remove the e.p. captured pawn.

            if (calculateAnimations) {
                newBoard.newMoveAnimation.captureSquareIndex = epCapturedPawnIndex;
                newBoard.newMoveAnimation.capturedPiece = { piece: Chess.PieceType.Pawn, player: this.getNonCurrentPlayer() }
            }
        } else if (move.isCapture && calculateAnimations) {
            // Plain old capture - captured piece must vanish.
            newBoard.newMoveAnimation.capturedPiece = this.getSquarePieceByIndex(toIndex);
        }

        const finalPieceType = (move.sideEffect === MoveSideEffect.PromoteToQueen
            ? (PieceType.Queen + (this.isWhiteToMove ? 0 : 7))
            : movingPiece);
        newBoard.squares[toIndex] = finalPieceType;

        if (calculateAnimations && finalPieceType !== movingPiece) {
            newBoard.newMoveAnimation.finalPiece = { piece: finalPieceType, player: this.getNonCurrentPlayer() };
        }

        let sideEffect = move.sideEffect;
        let castlingAction: CastlingPotential = 0;
        if (movingPiece === PieceType.King || movingPiece === (PieceType.King + 7)) {
            if (Math.abs(move.fromSquare.file - move.toSquare.file) === 2) {
                // Castling: move the rook.
                const isWhiteCastling = this.isWhiteToMove;
                const isKingsideCastling = move.toSquare.file === 7;
                let rookFromSquare: BoardSquare, rookToSquare: BoardSquare;
                if (isWhiteCastling) {
                    if (isKingsideCastling) {
                        rookFromSquare = BoardResources.byFileAndRank(8, 1);
                        rookToSquare = BoardResources.byFileAndRank(6, 1);
                        castlingAction = CastlingPotential.WhiteKingside;
                    } else {
                        rookFromSquare = BoardResources.byFileAndRank(1, 1);
                        rookToSquare = BoardResources.byFileAndRank(4, 1);
                        castlingAction = CastlingPotential.WhiteQueenside;
                    }
                } else {
                    // Black is castling
                    if (isKingsideCastling) {
                        rookFromSquare = BoardResources.byFileAndRank(8, 8);
                        rookToSquare = BoardResources.byFileAndRank(6, 8);
                        castlingAction = CastlingPotential.BlackKingside;
                    } else {
                        rookFromSquare = BoardResources.byFileAndRank(1, 8);
                        rookToSquare = BoardResources.byFileAndRank(4, 8);
                        castlingAction = CastlingPotential.BlackQueenside;
                    }
                }
                const rookFromIndex = rookFromSquare.index;
                const rookToIndex = rookToSquare.index;
                const rookPieceType = newBoard.squares[rookFromIndex];
                newBoard.squares[rookFromIndex] = 0;
                newBoard.squares[rookToIndex] = rookPieceType;

                sideEffect = MoveSideEffect.NullifiesKingsideCastling + MoveSideEffect.NullifiesQueensideCastling;
                if (calculateAnimations) {
                    newBoard.newMoveAnimation = {
                        castlingType: castlingAction,
                        fromSquareIndex: -1,
                        toSquareIndex: -1,
                        movingPiece: null
                    }
                }
            }
        }

        //let castlingNullification = 0;
        if (sideEffect > 0) {
            //castlingNullification = sideEffect & (MoveSideEffect.NullifiesKingsideCastling + MoveSideEffect.NullifiesQueensideCastling);
            newBoard.castlingStatus = Board.getNewCastlingPotential(this.castlingStatus, sideEffect, this.isWhiteToMove);
            if (sideEffect === MoveSideEffect.EnablesEnPassantCapture) {
                newBoard.enPassantActiveFile = move.fromSquare.file;
            }
        } else {
            newBoard.castlingStatus = this.castlingStatus;
        }

        newBoard.isWhiteToMove = !this.isWhiteToMove;
        newBoard.moveCount = this.moveCount + 1;
        return newBoard;
    }

    public getCheckState(): CheckState {
        const potentialMoves = this.getPotentialMoves();
        const playerHasLegalMove = potentialMoves.some(move => this.isLegalMove(move) !== null);

        if (this.playerIsInCheck()) {
            // The current player is in check.  Does he have a move?
            return playerHasLegalMove ? CheckState.Check : CheckState.Checkmate;
        }
        return playerHasLegalMove ? CheckState.None : CheckState.Stalemate;
    }

    public getMoveDisambiguationSquare(move: GameMove): string {

        // If another knight, rook, queen (or even a promoted bishop!) could make this move, return its location.
        // Otherwise return null.

        const fromIndex = move.fromSquare.index;
        const toIndex = move.toSquare.index;
        const movingPiece = this.getSquarePieceByIndex(fromIndex).piece;
        if (movingPiece === PieceType.Pawn || movingPiece === PieceType.King) {
            return null;
        }

        const potentialMoves = this.getPotentialMoves();
        // See if another piece of this type could move to the destination square.  We ignore checks,
        // which could mean that we disambiguate a move that actually doesn't need it, but that's not a huge deal.

        let ambiguousMove = potentialMoves.filter(checkMove =>
            checkMove.fromSquare.index !== fromIndex
            && checkMove.toSquare.index === toIndex
            && checkMove.piece === movingPiece
        );

        if (ambiguousMove.length) {
            return ambiguousMove[0].fromSquare.algebraicNotation;
        }
        return null;
    }

    private static getNewCastlingPotential(originalPotential: number, castlingNullifications: number, isWhiteToMove: boolean) {
        if (originalPotential === 0 || castlingNullifications === 0) {
            return originalPotential;  // shortcut.
        }
        let colouredNullification: number;
        if (isWhiteToMove) {
            colouredNullification = ((castlingNullifications & MoveSideEffect.NullifiesKingsideCastling) ? CastlingPotential.WhiteKingside : 0)
                + ((castlingNullifications & MoveSideEffect.NullifiesQueensideCastling) ? CastlingPotential.WhiteQueenside : 0);
        } else {
            colouredNullification = ((castlingNullifications & MoveSideEffect.NullifiesKingsideCastling) ? CastlingPotential.BlackKingside : 0)
                + ((castlingNullifications & MoveSideEffect.NullifiesQueensideCastling) ? CastlingPotential.BlackQueenside : 0);
        }

        return originalPotential & ~colouredNullification;
    }
}