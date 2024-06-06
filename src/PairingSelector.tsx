import * as Chess from './app/engine/ChessElements'
import { ChangeEvent, FC, useState } from 'react';
import GamePairing from './app/players/GamePairing';

export interface PairingSelectedEvent extends CustomEvent<GamePairing> { }

interface PairingSelectorProps {
    handlePairingSelected: (e: PairingSelectedEvent) => void
}

const PairingSelector: FC<PairingSelectorProps> = ({ handlePairingSelected }) => {

    const [whiteSelection, setWhiteSelection] = useState(Chess.PlayerType.Human);
    const [blackSelection, setBlackSelection] = useState(Chess.PlayerType.Human);

    const eventToPlayerType = (e: ChangeEvent<HTMLSelectElement>) => e.target.value === "human" ? Chess.PlayerType.Human : Chess.PlayerType.Engine;

    const handleWhiteChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setWhiteSelection(eventToPlayerType(e));
    };

    const handleBlackChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setBlackSelection(eventToPlayerType(e));
    };

    const handleStartGame = () => {
        handlePairingSelected(new CustomEvent<GamePairing>("gameStart", { detail: new GamePairing(whiteSelection, blackSelection) }));
    };

    return (
        <div>
            <label>White:</label><select onChange={handleWhiteChange}>
                <option value="human">Human</option>
                <option value="engine">Computer</option>
            </select>
            <label>Black:</label><select onChange={handleBlackChange}>
                <option value="human">Human</option>
                <option value="engine">Computer</option>
            </select>
            <button onClick={handleStartGame}>Start Game</button>
        </div>
    )
}

export default PairingSelector;