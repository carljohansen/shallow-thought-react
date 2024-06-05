import * as Chess from './app/engine/ChessElements'
import { useEffect, useState } from 'react';
import './App.css';
import './app/ui/css/game.component.css';
import './app/ui/css/movelist.component.css';
import './app/ui/css/piece.component.css';
import Game, { MoveSelectedEvent } from './Game';
import { ISingleMovePlayer, MoveEvent, ProgressUpdatedEvent } from './app/players/PlayerInterface';
import { GameHelper } from './app/engine/GameHelper';
import { PlayerFactory } from './app/players/PlayerFactory';

Chess.BoardResources.init();

const initialBoard = GameHelper.createStandardBoard();

function App() {

  const [newMove, setNewMove] = useState<Chess.GameMove>(null);
  const [board, setBoard] = useState<Chess.Board>(initialBoard);
  const [player, setPlayer] = useState<ISingleMovePlayer>(null);

  useEffect(() => {
    if (player) {
      player.activate(); // Mainly this is to start a new engine player calculating.
    }
  }, [player]);

  function createPlayerForNextMove(playersBoard: Chess.Board): ISingleMovePlayer {

    const handleMoveMade = (e: MoveEvent) => {
      const move = e.detail;
      console.log(`Move made: ${move.fromSquare.algebraicNotation} to ${move.toSquare.algebraicNotation}`);
      setNewMove(e.detail);

      if (!move) {
        alert("Game over!");
        return null;
      }

      let validatedMove = playersBoard.isLegalMove(move);
      if (!validatedMove) {
        alert("That move is not legal..");
        // TODO: fix this
        //this.activePlayer.deactivate();
        //this.activePlayer.activate(this.board);
        return null;
      }

      // Annotate the move with disambiguation information (this improves our move list display).
      validatedMove.disambiguationSquare = playersBoard.getMoveDisambiguationSquare(validatedMove);

      const newBoard = playersBoard.applyMove(validatedMove);
      setBoard(newBoard);

      validatedMove.checkHint = playersBoard.getCheckState();
      //this.moveHistory.push(validatedMove);

      singleMovePlayer.dispose();

      setPlayerForNextMove(newBoard);
    };

    let singleMovePlayer: ISingleMovePlayer;

    if (playersBoard.isWhiteToMove) {
      singleMovePlayer = PlayerFactory.createHumanPlayerForSingleMove(playersBoard,
        handleMoveMade
      );
    } else {
      singleMovePlayer = PlayerFactory.createArtificalPlayerForSingleMove(playersBoard,
        handleMoveMade,

        (e: ProgressUpdatedEvent) => {
          //console.log("progress: " + e.detail);
        }
      );
    }
    return singleMovePlayer;
  }

  const onHumanMoveSelected = (event: MoveSelectedEvent) => {
    player.handleMoveSelection(event);
  }

  function setPlayerForFirstMove() {
    setPlayerForNextMove(board);
  }

  function setPlayerForNextMove(newBoard: Chess.Board) {
    setPlayer(createPlayerForNextMove(newBoard));
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ position: "absolute", top: "0px", left: "0px", height: "80px" }}>
          <button title="Start Game" onClick={setPlayerForFirstMove}>Start Game</button>
        </div>
        <Game gameBoard={board} newMove={newMove} handleMoveInput={onHumanMoveSelected} />
      </header>
    </div>
  );
}

export default App;
