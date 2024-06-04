import * as Chess from './app/engine/ChessElements'
import { useState } from 'react';
import './App.css';
import './app/ui/css/game.component.css';
import './app/ui/css/movelist.component.css';
import './app/ui/css/piece.component.css';
import Game, { MoveSelectedEvent } from './Game';
import { GameSession } from './app/players/GameSession';
import { ArtificialPlayer } from './app/players/ArtificialPlayer';

function App() {  

  const [newMove, setNewMove] = useState<Chess.GameMove>(null);
  const [gameSession, setGameSession] = useState<GameSession>(() => {

    Chess.BoardResources.init();

    const whitePlayer = new ArtificialPlayer(Chess.Player.White);
    const blackPlayer = new ArtificialPlayer(Chess.Player.Black);
    const newGame = GameSession.createStandardGame(whitePlayer, blackPlayer);

    newGame.whitePlayer.activate(newGame.board);

    newGame.movePlayed$.subscribe(move => {
      setNewMove(move);
    })
    return newGame;
  });


  const onHumanMoveSelected = (event: MoveSelectedEvent) => {
    // const newBoard = gameBoard.applyMove(event.detail);
    // setGameBoard(newBoard);
    // setNewMove(event.detail);
  }

  //setGameBoard(createStandardBoard());

  return (
    <div className="App">
      <header className="App-header">
        <Game gameBoard={gameSession.board} newMove={newMove} handleMoveInput={onHumanMoveSelected} />
      </header>
    </div>
  );
}

export default App;
