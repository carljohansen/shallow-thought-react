import React, { FC } from 'react';

interface SquareProps {
    name: string,
    isLight: boolean,
    isHighlighed?: boolean,
    handleClick: React.MouseEventHandler<HTMLDivElement>
}

const Square: FC<SquareProps> = ({ name, isLight, handleClick, isHighlighed = false }) => {

    const squareClass = "boardsquare " + (isLight ? "lightsquare" : "darksquare") + (isHighlighed ? " selectedFromSquare" : "");

    return (
        <div className={squareClass} onClick={handleClick} />
    )
}


export default Square;