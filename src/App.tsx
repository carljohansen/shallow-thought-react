import * as Chess from './app/engine/ChessElements'
import { useEffect, useState } from 'react';
import './App.css';
import './app/ui/css/game.component.css';
import './app/ui/css/movelist.component.css';
import './app/ui/css/piece.component.css';
import Game, { MoveSelectedEvent } from './Game';
import MoveList from './MoveList';
import MoveProgressBar from './MoveProgressBar';
import { ISingleMovePlayer, MoveEvent, ProgressUpdatedEvent } from './app/players/PlayerInterface';
import { GamePairing } from './app/players/GamePairing';
import { GameHelper } from './app/engine/GameHelper';

Chess.BoardResources.init();

const initialBoard = GameHelper.createStandardBoard();
//const pairing = new GamePairing(Chess.PlayerType.Human, Chess.PlayerType.Human);
const pairing = new GamePairing(Chess.PlayerType.Engine, Chess.PlayerType.Engine);

function App() {

  const [newMove, setNewMove] = useState<Chess.GameMove>(null);
  const [evaluationProgress, setEvaluationProgress] = useState<number>(0);
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
      handleMoveMade,
      handleProgressUpdate);
    return currPlayer;
  }

  function handleProgressUpdate(e: ProgressUpdatedEvent) {
    setEvaluationProgress(e.detail);
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

  if (board
    && board.moveCount === 0
    && !player) {
    setPlayerForFirstMove();
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ position: "absolute", top: "0px", left: "0px", height: "80px" }}>
          <MoveProgressBar progress={evaluationProgress}></MoveProgressBar>
        </div>
        <div style={{ position: "absolute", top: "50px", left: "0px", height: "80px" }}>
          <MoveList moveList={moveList}></MoveList>
        </div>
        <Game gameBoard={board} newMove={newMove} handleMoveInput={onHumanMoveSelected} />
      </header>
    </div>
  );
}

export default App;
