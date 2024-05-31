import React from 'react';
import './App.css';
import './app/ui/css/game.component.css';
import './app/ui/css/movelist.component.css';
import './app/ui/css/piece.component.css';
import Piece from './Piece';
import Board from './Board';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Shallow Thought (React) starts here!
        </p>
        <Board game="" />
      </header>
    </div>
  );
}

export default App;
