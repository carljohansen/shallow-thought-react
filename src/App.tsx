import * as Chess from './app/engine/ChessElements'
import { useCallback, useEffect, useState } from 'react';
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

  function createPlayerForNextMove(playersBoard: Chess.Board): ISingleMovePlayer {

    let currPlayer: ISingleMovePlayer;

    const handleMoveMade = (e: MoveEvent) => {

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
      //this.moveHistory.push(validatedMove);

      setPlayerForNextMove(newBoard);
      return currPlayer;
    };

    currPlayer = pairing.createPlayerForNextMove(playersBoard, handleMoveMade);
    return currPlayer;
  }

  const onHumanMoveSelected = useCallback((event: MoveSelectedEvent) => {
    player.handleMoveSelection(event);
  }, [player]);

  function setPlayerForFirstMove() {
    if (pairing === null) {
      return
    }
    setPlayerForNextMove(board);
  }

  function setPlayerForNextMove(newBoard: Chess.Board) {
    setPlayer(createPlayerForNextMove(newBoard));
  }

  if (board
    && board.moveCount === 0
    && !player) {
    setPlayerForFirstMove();
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
