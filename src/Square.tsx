import * as Chess from './app/engine/ChessElements'
import { FC } from 'react';
import { SquareSelectedEvent } from './Game';

interface SquareProps {
    boardSquare: Chess.BoardSquare,
    isLight: boolean,
    isHighlighted?: boolean,
    handleClick: (e: SquareSelectedEvent) => void
}

const Square: FC<SquareProps> = ({ boardSquare, isLight, handleClick, isHighlighted = false }) => {

    const squareClass = "boardsquare " + (isLight ? "lightsquare" : "darksquare") + (isHighlighted ? " selectedFromSquare" : "");    

    return (
        <div className={squareClass} onClick={() => {
            const eventType = isHighlighted ? "squareDeselected" : "squareSelected";
            handleClick(new CustomEvent(eventType, { detail: boardSquare }));
        }} />
    )
}


export default Square;