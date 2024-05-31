import React, { FC } from 'react';

interface SquareProps { isLight: boolean, isHighlighed?: boolean }

const Square: FC<SquareProps> = ({ isLight, isHighlighed = false }) => {

    const squareClass = "boardsquare " + (isLight ? "lightsquare" : "darksquare") + (isHighlighed ? " selectedFromSquare" : "");

    return (
        <div className={squareClass} />
    )
}


export default Square;