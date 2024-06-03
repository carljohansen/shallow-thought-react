import React, { FC } from 'react';
import { SquareSelectedEvent } from './Game';

interface SquareProps {
    name: string,
    isLight: boolean,
    isHighlighed?: boolean,
    handleClick: (e: SquareSelectedEvent) => void
}

const Square: FC<SquareProps> = ({ name, isLight, handleClick, isHighlighed = false }) => {

    const squareClass = "boardsquare " + (isLight ? "lightsquare" : "darksquare") + (isHighlighed ? " selectedFromSquare" : "");

    return (
        <div className={squareClass} onClick={() => {
            const eventType = isHighlighed ? "squareDeselected" : "squareSelected";
            handleClick(new CustomEvent(eventType, { detail: name }));
        }} />
    )
}


export default Square;