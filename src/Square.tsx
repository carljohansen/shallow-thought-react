import * as Chess from './app/engine/ChessElements'
import React, { FC } from 'react';
import { SquareSelectedEvent } from './Game';

interface SquareProps {
    boardSquare: Chess.BoardSquare,
    isLight: boolean,
    isHighlighed?: boolean,
    handleClick: (e: SquareSelectedEvent) => void
}

const Square: FC<SquareProps> = ({ boardSquare, isLight, handleClick, isHighlighed = false }) => {

    const squareClass = "boardsquare " + (isLight ? "lightsquare" : "darksquare") + (isHighlighed ? " selectedFromSquare" : "");    

    return (
        <div className={squareClass} onClick={() => {
            const eventType = isHighlighed ? "squareDeselected" : "squareSelected";
            handleClick(new CustomEvent(eventType, { detail: boardSquare }));
        }} />
    )
}


export default Square;