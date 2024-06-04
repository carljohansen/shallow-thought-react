import { Subject } from 'rxjs';
import * as Chess from './ChessElements';

export interface MoveWithReplies {
    move: Chess.GameMove;
    replies: Chess.GameMove[];
}

interface EvaluatedMove {
    move: Chess.GameMove;
    score: number;
}

export class ComputerPlayer {

    public calculationProgress$: Subject<number> = new Subject<number>();

    public getMovesAndReplies(board: Chess.Board, headStartMoves: Chess.GameMove[]): MoveWithReplies[] {

        let initialMoves = headStartMoves || board.getPotentialMoves(true);
        const playerMoves = initialMoves.map(move => { return { move: move, replies: null } as MoveWithReplies; });

        for (let move of playerMoves) {
            if (move.move.isPawnAttack) {
                move.replies = [];
            } else {
                const tempBoard = board.applyMove(move.move);
                move.replies = tempBoard.getPotentialMoves(true);
            }
        }

        const legalMoves = playerMoves.filter(move => !move.replies.some(reply => reply.isTheoreticalKingCapture));

        legalMoves.sort((a, b) => (b.move.isCapture ? 1 : 0) * (b.move.piece || 1) - (a.move.isCapture ? 1 : 0) * (a.move.piece || 1));
        return legalMoves;
    }

    public getBestMove(board: Chess.Board): Chess.GameMove {

        const bestMove = this.getBestMoveMinimax(board, null, 0, true, null);
        if (bestMove.move === null) {
            return null;
        }
        return bestMove.move;
    }

    private getBestMoveMinimax(board: Chess.Board, headStartMoves: Chess.GameMove[], depth: number, isCaptureChain: boolean, alphaScore: number): EvaluatedMove {

        const movesAndReplies = this.getMovesAndReplies(board, headStartMoves);

        if (!movesAndReplies.some(move => !move.move.isPawnAttack)) {
            // Are we in mate or stalemate?
            board.isWhiteToMove = !board.isWhiteToMove;
            const gameEndingScore = board.playerHasTheoreticalKingCapture() ? 10000 : 0;
            board.isWhiteToMove = !board.isWhiteToMove;
            return { move: null, score: board.isWhiteToMove ? -(gameEndingScore - depth) : (gameEndingScore - depth) };
        }

        let maxDepth = isCaptureChain ? 6 : 4;
        // let maxDepth = 3;

        let bestMoveSoFar: Chess.GameMove = null;
        let bestScoreSoFar: number = null;

        const haveReachedDepthLimit = depth >= maxDepth;
        if (haveReachedDepthLimit) {
            board.isWhiteToMove = !board.isWhiteToMove;
            const opponentAttacks = board.getPotentialMoves(true);
            board.isWhiteToMove = !board.isWhiteToMove;

            return { move: null, score: EvaluationFunction.getEvaluation(board, movesAndReplies, opponentAttacks) };
        }

        let numMoves = movesAndReplies.length;
        let movesEvaluated = 0;
        for (let move of movesAndReplies) {

            if (depth === 0) {
                this.calculationProgress$.next(Math.floor((movesEvaluated++ / numMoves) * 100));
            }

            if (move.move.isPawnAttack) {
                continue;
            }

            let lineEvaluation: number;

            const boardAfterMove = board.applyMove(move.move);
            let bestReply = this.getBestMoveMinimax(boardAfterMove, move.replies, depth + 1, isCaptureChain && move.move.isCapture, bestScoreSoFar);
            lineEvaluation = bestReply.score;

            if (!bestMoveSoFar
                || ComputerPlayer.isBetterScore(lineEvaluation, bestScoreSoFar, board.isWhiteToMove)) {
                bestScoreSoFar = lineEvaluation;
                bestMoveSoFar = move.move;
            }

            if (alphaScore !== null
                && ComputerPlayer.isBetterScore(lineEvaluation, alphaScore, board.isWhiteToMove)) {
                break;
            }
        }
        if (depth === 0) {
            this.calculationProgress$.next(100);
        }

        return { move: bestMoveSoFar, score: bestScoreSoFar };
    }

    private static isBetterScore(newScore: number, baseScore, isWhiteToMove: boolean) {
        if (isWhiteToMove) {
            return newScore > baseScore;
        }
        return baseScore > newScore;
    }
}

class EvaluationFunction {

    private static materialValues = [0, 100, 330, 350, 500, 900, 0];
    private static pieceAttackWeights = [0, 0.9, 0.55, 0.55, 0.33, 0.1, 0.1];
    private static whiteAttackSquareWeights = [[],
  /* 1 */[0, 1, 1, 1, 1, 1, 1, 1, 1],
  /* 2 */[0, 1, 1, 1, 1, 1, 1, 1, 1],
  /* 3 */[0, 1.1, 1.1, 1.2, 1.3, 1.4, 1.4, 1.3, 1.1],
  /* 4 */[0, 1.25, 1.4, 2.5, 2.5, 1.6, 1.5, 1.45, 1.4],
  /* 5 */[0, 1.7, 1.9, 4.5, 5, 5, 2.4, 1.7, 1.72],
  /* 6 */[0, 1.7, 1.95, 1.98, 2, 2.1, 1.9, 1.8, 1.7],
  /* 7 */[0, 1.8, 1.8, 1.8, 2.4, 2.4, 2.8, 2.8, 2],
  /* 8 */[0, 1.8, 1.8, 1.8, 2.4, 2.4, 2.8, 2.8, 2]];

    private static attackSquareWeights: number[][][];

    private static ensureAttackSquareWeights(): void {
        if (!EvaluationFunction.attackSquareWeights) {
            EvaluationFunction.attackSquareWeights = [];
            EvaluationFunction.attackSquareWeights[0] = EvaluationFunction.whiteAttackSquareWeights;
            EvaluationFunction.attackSquareWeights[1] = []
            EvaluationFunction.attackSquareWeights[1][0] = []
            for (let i = 1; i <= 8; i++) {
                EvaluationFunction.attackSquareWeights[1][i] = EvaluationFunction.attackSquareWeights[0][9 - i]
            }
        }
    }

    public static getEvaluation(board: Chess.Board, movesAndReplies: MoveWithReplies[], opponentAttacks: Chess.GameMove[]): number {
        let result = 0;
        EvaluationFunction.ensureAttackSquareWeights();
        const playerIndex = board.isWhiteToMove ? 0 : 1;
        const opponentIndex = 1 - playerIndex;
        const scoreScaler = [1, -1];
        const opponentScoreScaler = board.isWhiteToMove ? -1 : 1;

        board.forEachOccupiedSquare(square => {
            result += EvaluationFunction.materialValues[square.piece.piece] * (square.piece.player === Chess.Player.White ? 1 : -1);
        });

        for (let move of movesAndReplies) {
            if ((!move.move.isPawnAttack)
                && move.replies.some(reply => reply.isTheoreticalKingCapture)) {
                continue; // move is not legal.
            }
            const movingPieceType = board.getSquarePieceByIndex(move.move.fromSquare.index).piece;
            if (movingPieceType === Chess.PieceType.Pawn
                && !move.move.isCapture
                && !move.move.isPawnAttack) {
                continue; // A potential pawn pushing move is no kind of attack.
            }
            result += EvaluationFunction.attackSquareWeights[playerIndex][move.move.toSquare.rank][move.move.toSquare.file]
                * EvaluationFunction.pieceAttackWeights[movingPieceType]
                * scoreScaler[playerIndex];
        }
        for (let reply of opponentAttacks) {

            const movingPieceType = board.getSquarePieceByIndex(reply.fromSquare.index).piece;
            if (movingPieceType === Chess.PieceType.Pawn
                && !reply.isCapture
                && !reply.isPawnAttack) {
                continue; // A potential pawn pushing move is no kind of attack.
            }

            result += EvaluationFunction.attackSquareWeights[opponentIndex][reply.toSquare.rank][reply.toSquare.file]
                * EvaluationFunction.pieceAttackWeights[movingPieceType]
                * scoreScaler[opponentIndex];
        }
        return result;
    }
}