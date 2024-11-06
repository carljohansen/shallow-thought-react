import * as Chess from './app/engine/ChessElements'
import { useEffect, useState } from 'react';
import './App.css';
import Game, { MoveSelectedEvent } from './Game';
import MoveList from './MoveList';
import MoveProgressBar from './MoveProgressBar';
import { ISingleMovePlayer, MoveEvent } from './app/players/PlayerInterface';
import GamePairing from './app/players/GamePairing';
import PairingSelector, { PairingSelectedEvent } from './PairingSelector';

Chess.BoardResources.init();

function App() {

  const [pairing, setPairing] = useState<GamePairing>(null);
  const [moveList, setMoveList] = useState<Chess.GameMove[]>([]);
  const [board, setBoard] = useState<Chess.Board>(null);
  const [player, setPlayer] = useState<ISingleMovePlayer>(null);

  useEffect(() => {
    if (player) {
      player.activate(); // Mainly this is to start a new engine player calculating.
    }
  }, [player]);

  function createPlayerForNextMove(playersBoard: Chess.Board, gamePairing: GamePairing): ISingleMovePlayer {

    const handleMoveMade = (e: MoveEvent) => {

      // This is called at the end of the Player's life, after they have chosen
      // their move.  It applies the move to the App's board, disposes the Player
      // and creates (but does not activate) a new Player for the next move.
      // The new Player will be activated by the App's effect.

      currPlayer.dispose();

      const move = e.detail;

      if (!move) {
        setTimeout(() => {
          alert('Game over!');
        }, 400);
        return null;
      }

      // Annotate the move with disambiguation information (this improves our move list display).
      move.disambiguationSquare = playersBoard.getMoveDisambiguationSquare(move);

      const newBoard = playersBoard.applyMove(move, true);
      move.checkHint = newBoard.getCheckState();

      setBoard(newBoard);
      setMoveList(curr => [...curr, move])

      createAndSetPlayerForNextMove(newBoard, gamePairing);
      return currPlayer;
    };
    const currPlayer: ISingleMovePlayer = gamePairing.createPlayerForNextMove(playersBoard, handleMoveMade);
    return currPlayer;
  }

  const onHumanMoveSelected = (e: MoveSelectedEvent) => { player.handleMoveSelection(e); }

  function setPlayerForFirstMove(initialBoard: Chess.Board, pairing: GamePairing) {
    createAndSetPlayerForNextMove(initialBoard, pairing);
  }

  function createAndSetPlayerForNextMove(newBoard: Chess.Board, pairing: GamePairing) {
    setPlayer(createPlayerForNextMove(newBoard, pairing));
  }

  const boardOrientation: Chess.Player = pairing?.getPreferredOrientation();

  function handlePairingSelected(e: PairingSelectedEvent) {
    const selectedPairing = e.detail;
    const initialBoard = selectedPairing.createBoard();

    setBoard(initialBoard);
    setPairing(selectedPairing);

    if (!initialBoard.isWhiteToMove) {
      setMoveList([null]); // blank move for white since black starts.
    }

    setPlayerForFirstMove(initialBoard, selectedPairing);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ position: "absolute", top: "0px", left: "0px", height: "80px" }}>
          <MoveProgressBar player={player}></MoveProgressBar>
        </div>
        <MoveList moveList={moveList}></MoveList>
        {pairing === null ?
          (
            <PairingSelector
              handlePairingSelected={handlePairingSelected} />
          ) :
          (<Game gameBoard={board} handleMoveInput={onHumanMoveSelected} orientation={boardOrientation} />)
        }
      </header>
    </div>
  );
}

export default App;
