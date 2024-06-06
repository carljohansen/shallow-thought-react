import * as Chess from '../engine/ChessElements'
import { ArtificialSingleMovePlayer } from './ArtificialSingleMovePlayer';
import { HumanSingleMovePlayer } from './HumanSingleMovePlayer';
import { ISingleMovePlayer, MoveEvent } from './PlayerInterface';

export class PlayerFactory {

    public static createArtificalPlayerForSingleMove(board: Chess.Board,
        handleMove: (e: MoveEvent) => void): ISingleMovePlayer {

        return new ArtificialSingleMovePlayer(board,
            handleMove);
    }

    public static createHumanPlayerForSingleMove(board: Chess.Board,
        handleMove: (e: MoveEvent) => void): ISingleMovePlayer {

        return new HumanSingleMovePlayer(board,
            handleMove);
    }
}

