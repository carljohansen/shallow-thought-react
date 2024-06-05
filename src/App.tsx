import * as Chess from './app/engine/ChessElements'
import { useEffect, useState } from 'react';
import './App.css';
import './app/ui/css/game.component.css';
import './app/ui/css/movelist.component.css';
import './app/ui/css/piece.component.css';
import Game, { MoveSelectedEvent } from './Game';
import { GameSession } from './app/players/GameSession';
import { MoveEvent, PlayerFactory, ProgressUpdatedEvent } from './app/players/PlayerBase';

function App() {

  Chess.BoardResources.init();

  const [newMove, setNewMove] = useState<Chess.GameMove>(null);
  const [board, setBoard] = useState<Chess.Board>(() => GameSession.createStandardBoard());

  function startNextMove() {

    const singleMovePlayer = PlayerFactory.createArtificalPlayerForSingleMove(board,
      (e: MoveEvent) => {
        const move = e.detail;
        console.log(`Move made: ${move.fromSquare.algebraicNotation} to ${move.toSquare.algebraicNotation}`);
        setNewMove(e.detail);

        if (!move) {
          alert("Game over!");
          return null;
        }

        let validatedMove = board.isLegalMove(move);
        if (!validatedMove) {
          alert("That move is not legal..");
          // TODO: fix this
          //this.activePlayer.deactivate();
          //this.activePlayer.activate(this.board);
          return null;
        }

        // Annotate the move with disambiguation information (this improves our move list display).
        validatedMove.disambiguationSquare = board.getMoveDisambiguationSquare(validatedMove);

      //  setBoard(board.applyMove(validatedMove));

        validatedMove.checkHint = board.getCheckState();
        //this.moveHistory.push(validatedMove);

        singleMovePlayer.dispose();
      },
      (e: ProgressUpdatedEvent) => {
        //console.log("progress: " + e.detail);
      }
    );

    singleMovePlayer.activate();
  }

  useEffect(startNextMove, [board]);

  // const [gameSession, setGameSession] = useState<GameSession>(() => {


  //   const whitePlayer = new ArtificialPlayer(Chess.Player.White);
  //   const blackPlayer = new ArtificialPlayer(Chess.Player.Black);
  //   const newGame = GameSession.createStandardGame(whitePlayer, blackPlayer);

  //   newGame.whitePlayer.activate(newGame.board);

  //   newGame.movePlayed$.subscribe(move => {
  //     setNewMove(move);
  //   })
  //   return newGame;
  // });


  const onHumanMoveSelected = (event: MoveSelectedEvent) => {
    // const newBoard = gameBoard.applyMove(event.detail);
    // setGameBoard(newBoard);
    // setNewMove(event.detail);
  }

  //setGameBoard(createStandardBoard());

  return (
    <div className="App">
      <header className="App-header">
        <Game gameBoard={board} newMove={newMove} handleMoveInput={onHumanMoveSelected} />
      </header>
    </div>
  );
}

export default App;
