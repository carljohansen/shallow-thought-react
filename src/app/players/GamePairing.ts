import * as Chess from '../engine/ChessElements';
import { PlayerFactory } from './PlayerFactory';
import { MoveEvent, ProgressUpdatedEvent, ISingleMovePlayer } from './PlayerInterface';

export default class GamePairing {

    constructor(public readonly whitePlayerType: Chess.PlayerType,
        public readonly blackPlayerType: Chess.PlayerType) { }

    public createPlayerForNextMove(board: Chess.Board,
        handleMoveMade: (e: MoveEvent) => void,
        handleProgressUpdate: (e: ProgressUpdatedEvent) => void): ISingleMovePlayer {

        const playerType = board.isWhiteToMove ? this.whitePlayerType : this.blackPlayerType;
        if (playerType === Chess.PlayerType.Human) {
            return PlayerFactory.createHumanPlayerForSingleMove(board,
                handleMoveMade,
                handleProgressUpdate);
        } else {
            return PlayerFactory.createArtificalPlayerForSingleMove(board,
                handleMoveMade,
                handleProgressUpdate);
        }
    }

    public getPreferredOrientation(): Chess.Player {
        if (this.whitePlayerType === Chess.PlayerType.Engine
            && this.blackPlayerType === Chess.PlayerType.Human) {
            return Chess.Player.Black;
        }
        return Chess.Player.White;
    }
}
