import React from 'react';
import './App.css';
import './app/ui/css/game.component.css';
import './app/ui/css/movelist.component.css';
import './app/ui/css/piece.component.css';
import Square from './Square';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Shallow Thought (React) starts here!
        </p>
        <Square isLight={true}/>
        <Square isLight={false} isHighlighed={true}/>
        <Square isLight={true}/>
      </header>
    </div>
  );
}

export default App;
