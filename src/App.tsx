import * as Chess from './app/engine/ChessElements'
import { useCallback, useEffect, useState } from 'react';
import './App.css';
import './app/ui/css/game.component.css';
import './app/ui/css/pairingselector.component.css';
import './app/ui/css/movelist.component.css';
import './app/ui/css/piece.component.css';
import Game, { MoveSelectedEvent } from './Game';
import MoveList from './MoveList';
import MoveProgressBar from './MoveProgressBar';
import { ISingleMovePlayer, MoveEvent } from './app/players/PlayerInterface';
import GamePairing from './app/players/GamePairing';
import { GameHelper } from './app/engine/GameHelper';
import PairingSelector, { PairingSelectedEvent } from './PairingSelector';

Chess.BoardResources.init();

const initialBoard = GameHelper.createStandardBoard();

function App() {

  const [pairing, setPairing] = useState<GamePairing>(null);
  const [newMove, setNewMove] = useState<Chess.GameMove>(null);
  const [moveList, setMoveList] = useState<Chess.GameMove[]>([]);
  const [board, setBoard] = useState<Chess.Board>(initialBoard);
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
      setNewMove(move);

      if (!move) {
        alert("Game over!");
        return null;
      }

      // Annotate the move with disambiguation information (this improves our move list display).
      move.disambiguationSquare = playersBoard.getMoveDisambiguationSquare(move);

      const newBoard = playersBoard.applyMove(move);
      move.checkHint = newBoard.getCheckState();

      setBoard(newBoard);
      setMoveList(curr => [...curr, move])
      //this.moveHistory.push(validatedMove);

      setPlayerForNextMove(newBoard);
      return currPlayer;
    };

    currPlayer = pairing.createPlayerForNextMove(playersBoard,
      handleMoveMade);
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

  let boardOrientation: Chess.Player = pairing?.getPreferredOrientation();

  function handlePairingSelected(e: PairingSelectedEvent) {
    setPairing(e.detail);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ position: "absolute", top: "0px", left: "0px", height: "80px" }}>
          <MoveProgressBar player={player}></MoveProgressBar>
        </div>
        <div style={{ position: "absolute", top: "50px", left: "0px", height: "80px" }}>
          <MoveList moveList={moveList}></MoveList>
        </div>
        {pairing === null ?
          (<div style={{ position: "absolute", top: "10px", left: "400px" }}>
            <PairingSelector
              handlePairingSelected={handlePairingSelected} />
          </div>) :
          (<Game gameBoard={board} newMove={newMove} handleMoveInput={onHumanMoveSelected} orientation={boardOrientation} />)
        }
      </header>
    </div>
  );
}

export default App;
