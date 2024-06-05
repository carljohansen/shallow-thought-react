import * as Chess from '../engine/ChessElements'
import { ArtificialSingleMovePlayer } from './ArtificialSingleMovePlayer';
import { HumanSingleMovePlayer } from './HumanSingleMovePlayer';
import { ISingleMovePlayer, MoveEvent, ProgressUpdatedEvent } from './PlayerInterface';

export class PlayerFactory {

    public static createArtificalPlayerForSingleMove(board: Chess.Board,
        handleMove: (e: MoveEvent) => void,
        handleProgress: (e: ProgressUpdatedEvent) => void): ISingleMovePlayer {

        return new ArtificialSingleMovePlayer(board,
            handleMove,
            handleProgress);
    }

    public static createHumanPlayerForSingleMove(board: Chess.Board,
        handleMove: (e: MoveEvent) => void,
        handleProgress: (e: ProgressUpdatedEvent) => void): ISingleMovePlayer {

        return new HumanSingleMovePlayer(board,
            handleMove,
            handleProgress);
    }
}

