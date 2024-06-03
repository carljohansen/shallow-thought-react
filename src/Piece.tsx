import React, { FC } from 'react';
import * as Chess from './app/engine/ChessElements';

interface PieceProps {
    leftPx: number,
    topPx: number,
    isWhite: boolean,
    pieceType: Chess.PieceType
}

const Piece: FC<PieceProps> = ({ leftPx, topPx, isWhite, pieceType }) => {

    let imagePieceName: string;
    switch (pieceType) {
        case Chess.PieceType.Pawn:
            imagePieceName = "p";
            break;
        default:
            imagePieceName = "xx";
            break;
    }

    const imageName = `/img/${imagePieceName}${isWhite ? 'l' : 'd'}.png`;
    return (
        <img alt="" className="piece" src={imageName} style={{ left: `${leftPx}px`, top: `${topPx}px` }}></img >
    )
}



export default Piece;