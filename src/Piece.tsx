import React, { FC } from 'react';
import * as Chess from './app/engine/ChessElements';

interface PieceProps {
    occupiedSquare: Chess.OccupiedSquare
}

const Piece: FC<PieceProps> = ({ occupiedSquare }) => {

    let imagePieceName: string;
    switch (occupiedSquare.piece.piece) {
        case Chess.PieceType.Pawn:
            imagePieceName = "p";
            break;
        case Chess.PieceType.Knight:
            imagePieceName = "n";
            break;
        case Chess.PieceType.Bishop:
            imagePieceName = "b";
            break;
        case Chess.PieceType.Rook:
            imagePieceName = "r";
            break;
        case Chess.PieceType.Queen:
            imagePieceName = "q";
            break;
        case Chess.PieceType.King:
            imagePieceName = "k";
            break;
        default:
            imagePieceName = "xx";
            break;
    }

    const imageName = `/img/${imagePieceName}${occupiedSquare.piece.player === Chess.Player.White ? 'l' : 'd'}.png`;
    const leftPx = (occupiedSquare.square.file - 1) * 60;
    const topPx = (8 - occupiedSquare.square.rank) * 60;
    return (
        <img alt="" className="piece" src={imageName} style={{ left: `${leftPx}px`, top: `${topPx}px` }}></img >
    )
}



export default Piece;