import { FC } from 'react'
import * as Chess from './app/engine/ChessElements'

interface MoveListProps {
    moveList: Chess.GameMove[]
}

const MoveList: FC<MoveListProps> = ({ moveList }) => {

    const rows = [];
    let moveNumber = 1;
    for (let i = 0; i < moveList.length; i += 2) {
        const whiteMove = Chess.GameMove.getNotation(moveList[i]);
        const blackMove = i < moveList.length - 1
            ? Chess.GameMove.getNotation(moveList[i + 1])
            : "";

        rows.push((
            <tr key={moveNumber}>
                <td>{moveNumber++}</td>
                <td>{whiteMove}</td>
                <td>{blackMove}</td>
            </tr>
        ));
    }

    return (
        <div className='movelist-wrapper'>
            <table>
                <thead>
                    <tr>
                        <td>Move</td>
                        <td>White</td>
                        <td>Black</td>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}

export default MoveList;
