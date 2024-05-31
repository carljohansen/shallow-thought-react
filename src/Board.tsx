import React, { FC } from 'react';
import Square from './Square';

interface BoardProps { game?: any }

const Board: FC<BoardProps> = ({ game }) => {

    const squareDivs: JSX.Element[] = [];
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            squareDivs.push(
                (<Square isLight={(row % 2) === (col % 2)} />)
            )
        }
    }

    return (
        <div className="boardgrid">
            {squareDivs}
        </div>
    )
}

export default Board;