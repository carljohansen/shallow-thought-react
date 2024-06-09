import * as Chess from './app/engine/ChessElements';
import './app/ui/css/piece.component.css';
import React, { FC } from 'react';
import { motion } from "framer-motion";

interface PieceProps {
    occupiedSquare: Chess.OccupiedSquare,
    animatingMove?: Chess.MoveAnimationDefinition
}

const Piece: FC<PieceProps> = ({ occupiedSquare, animatingMove }) => {

    const isInPrimaryAnimation = !!animatingMove
        && animatingMove.fromSquareIndex === occupiedSquare.square.index;
    const isVanishing = !!animatingMove
        && (animatingMove.toSquareIndex === occupiedSquare.square.index
            || animatingMove.captureSquareIndex === occupiedSquare.square.index);

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

    let pieceColour = occupiedSquare.piece.player;
    if (animatingMove) {
        if (animatingMove.fromSquareIndex === occupiedSquare.square.index) {
            pieceColour = animatingMove.movingPiece.player;
        }
        else if (animatingMove.toSquareIndex === occupiedSquare.square.index) {
            pieceColour = animatingMove.capturedPiece.player;
        }
    }

    const imageName = `/img/${imagePieceName}${pieceColour === Chess.Player.White ? 'l' : 'd'}.png`;
    const leftPx = (occupiedSquare.square.screenFile - 1) * 60;
    const topPx = (8 - occupiedSquare.square.screenRank) * 60;
    const initialPos = { left: `${leftPx}px`, top: `${topPx}px` };

    if (isInPrimaryAnimation) {
        const toSquare = Chess.BoardResources.squares[animatingMove.toSquareIndex];
        const leftPx = (toSquare.file - 1) * 60;
        const topPx = (8 - toSquare.rank) * 60;
        const destPos = { left: `${leftPx}px`, top: `${topPx}px` };
        return (
            <motion.img alt="" className="piece" src={imageName} style={initialPos} animate={destPos}
                transition={{ duration: 0.3 }}></motion.img>
        )
    }

    if (isVanishing) {
        return (
            <motion.img alt="" className="piece" src={imageName} style={initialPos} 
                initial={{ opacity: 1 }} 
                animate={{ opacity: 0 }}
                transition={{ delay: 0.3, duration:0 }}></motion.img>
        )
    }

    return (
        <img alt="" className="piece" src={imageName} style={initialPos}></img >
    )
}



export default Piece;