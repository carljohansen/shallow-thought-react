import * as Chess from '../engine/ChessElements';
import GameHelper from '../engine/GameHelper';
import { PlayerFactory } from './PlayerFactory';
import { MoveEvent, ISingleMovePlayer } from './PlayerInterface';

export default class GamePairing {

    private _firstMover: Chess.Player;

    public get firstMover(): number {
        return this._firstMover;
    }

    constructor(public readonly whitePlayerType: Chess.PlayerType,
        public readonly blackPlayerType: Chess.PlayerType,
        public readonly startingPositionFen: string) { }

    public createBoard(): Chess.Board {
        const initialBoard = GameHelper.createBoardFromFen(this.startingPositionFen);
        this._firstMover = initialBoard.getCurrentPlayer();
        return initialBoard;
    }

    public createPlayerForNextMove(board: Chess.Board,
        handleMoveMade: (e: MoveEvent) => void): ISingleMovePlayer {

        const playerType = board.isWhiteToMove ? this.whitePlayerType : this.blackPlayerType;
        if (playerType === Chess.PlayerType.Human) {
            return PlayerFactory.createHumanPlayerForSingleMove(board,
                handleMoveMade);
        } else {
            return PlayerFactory.createArtificalPlayerForSingleMove(board,
                handleMoveMade);
        }
    }

    public getPreferredOrientation(): Chess.Player {
        if (this.firstMover === Chess.Player.Black) {
            // Looks like we set up from a FEN with black to start, so orient for black.
            return Chess.Player.Black;
        }

        if (this.whitePlayerType === Chess.PlayerType.Engine
            && this.blackPlayerType === Chess.PlayerType.Human) {
            // Human (black) is playing computer (white), so flip the board.
            return Chess.Player.Black;
        }
        return Chess.Player.White;
    }
}
