import * as Chess from './app/engine/ChessElements'
import { useEffect, useState } from 'react';
import './App.css';
import './app/ui/css/game.component.css';
import './app/ui/css/movelist.component.css';
import './app/ui/css/piece.component.css';
import Game, { MoveSelectedEvent } from './Game';
import { GameSession } from './app/players/GameSession';
import { ISingleMovePlayer, MoveEvent, PlayerFactory, ProgressUpdatedEvent } from './app/players/PlayerBase';

Chess.BoardResources.init();

const initialBoard = GameSession.createStandardBoard();

function App() {

  const [newMove, setNewMove] = useState<Chess.GameMove>(null);
  const [board, setBoard] = useState<Chess.Board>(initialBoard);
  const [player, setPlayer] = useState<ISingleMovePlayer>(null);

  useEffect(() => {
    if (player) {
      player.activate();
    }
  }, [player]);

  function createPlayerForNextMove(playersBoard:Chess.Board): ISingleMovePlayer {

    const singleMovePlayer = PlayerFactory.createArtificalPlayerForSingleMove(playersBoard,
      (e: MoveEvent) => {
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

        setPlayer(createPlayerForNextMove(newBoard));
      },

      (e: ProgressUpdatedEvent) => {
        //console.log("progress: " + e.detail);
      }
    );

    return singleMovePlayer;
  }

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
  // if (board.moveCount > 0) {
  //   startNextMove();
  // }

  function handleStartGame() {
    setPlayer(createPlayerForNextMove(board));
    //singleMovePlayer.activate();
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ position: "absolute", top: "0px", left: "0px", height: "80px" }}>
          <button title="Start Game" onClick={handleStartGame}>Start Game</button>
        </div>
        <Game gameBoard={board} newMove={newMove} handleMoveInput={onHumanMoveSelected} />
      </header>
    </div>
  );
}

export default App;
