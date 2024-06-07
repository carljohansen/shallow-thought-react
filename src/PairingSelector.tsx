import * as Chess from './app/engine/ChessElements'
import './app/ui/css/pairingselector.component.css';
import { ChangeEvent, FC, useState } from 'react';
import GamePairing from './app/players/GamePairing';

export interface PairingSelectedEvent extends CustomEvent<GamePairing> { }

interface PairingSelectorProps {
    handlePairingSelected: (e: PairingSelectedEvent) => void
}

const PairingSelector: FC<PairingSelectorProps> = ({ handlePairingSelected }) => {

    const standardGameFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    const [whiteSelection, setWhiteSelection] = useState(Chess.PlayerType.Human);
    const [blackSelection, setBlackSelection] = useState(Chess.PlayerType.Human);
    const [setupFen, setSetupFen] = useState(standardGameFen);

    const eventToPlayerType = (e: ChangeEvent<HTMLSelectElement>) => e.target.value === "human" ? Chess.PlayerType.Human : Chess.PlayerType.Engine;

    const handleWhiteChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setWhiteSelection(eventToPlayerType(e));
    };

    const handleBlackChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setBlackSelection(eventToPlayerType(e));
    };

    const handleFenChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setSetupFen(e.target.value);
    };

    const handleStartGame = () => {
        handlePairingSelected(new CustomEvent<GamePairing>("gameStart", { detail: new GamePairing(whiteSelection, blackSelection, setupFen) }));
    };

    return (
        <div className="pairing-selector-wrapper">
            <div className="dropdowns">
                <label>White</label><select onChange={handleWhiteChange}>
                    <option value="human">Human</option>
                    <option value="engine">Computer</option>
                </select>
                <label>Black</label><select onChange={handleBlackChange}>
                    <option value="human">Human</option>
                    <option value="engine">Computer</option>
                </select>
            </div>
            <div>
                <textarea rows={8} cols={40} onChange={handleFenChange} value={setupFen} />
            </div>
            <div>
                <button onClick={handleStartGame}>Start Game</button>
            </div>
        </div>
    )
}

export default PairingSelector;