import React, { FC } from 'react';

interface PieceProps {
    leftPx: number,
    topPx: number,
    isWhite: boolean,
    pieceCode: string
}

const Piece: FC<PieceProps> = ({ leftPx, topPx, isWhite, pieceCode }) => {

    let imagePieceName: string;
    switch (pieceCode) {
        case "pawn":
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