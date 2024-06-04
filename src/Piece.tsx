import React, { FC } from 'react';
import { motion } from "framer-motion";
import * as Chess from './app/engine/ChessElements';

interface PieceProps {
    occupiedSquare: Chess.OccupiedSquare,
    animatingMove?: Chess.GameMove
}

const Piece: FC<PieceProps> = ({ occupiedSquare, animatingMove }) => {

    const isInPrimaryAnimation = !!animatingMove
        && animatingMove.fromSquare.index === occupiedSquare.square.index;

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
    const initialPos = { left: `${leftPx}px`, top: `${topPx}px` };

    if (isInPrimaryAnimation) {
        const leftPx = (animatingMove.toSquare.file - 1) * 60;
        const topPx = (8 - animatingMove.toSquare.rank) * 60;
        const destPos = { left: `${leftPx}px`, top: `${topPx}px` };
        return (
            <motion.img alt="" className="piece" src={imageName} style={initialPos} animate={destPos}></motion.img>
        )
    }

    return (
        <img alt="" className="piece" src={imageName} style={initialPos}></img >
    )
}



export default Piece;