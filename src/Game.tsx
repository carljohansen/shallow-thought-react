import * as Chess from './app/engine/ChessElements'
import React, { FC, useState } from 'react';
import Square from './Square';
import { BoardSquare, GameMove } from './app/engine/ChessElements';
import Piece from './Piece';

export interface SquareSelectedEvent extends CustomEvent<BoardSquare> { }

export interface MoveSelectedEvent extends CustomEvent<GameMove> { }

interface GameProps {
    gameBoard: Chess.Board,
    newMove?: Chess.GameMove,
    handleMoveInput: (e: MoveSelectedEvent) => void
}

const Game: FC<GameProps> = ({ gameBoard, handleMoveInput, newMove = null }) => {

    const [selectedFromSquare, setSelectedFromSquare] = useState<BoardSquare>(null);

    const onSquareSelected = (event: SquareSelectedEvent) => {
        const selectedSquare = event.detail;
        if (event.type === "squareSelected") {
            if (!!selectedFromSquare) {
                moveSelected(selectedFromSquare, selectedSquare);
            } else {
                setSelectedFromSquare(selectedSquare);
            }
            return;
        }

        // De-selecting
        setSelectedFromSquare(null);
    };

    const moveSelected = (fromSquare: BoardSquare, toSquare: BoardSquare) => {
        const validatedMove = gameBoard.isLegalMove({ fromSquare: fromSquare, toSquare: toSquare });
        if (!!validatedMove) {
            handleMoveInput(new CustomEvent("humanMove", { detail: validatedMove }));
        } else {
            console.log("Invalid move!")
        }

        setSelectedFromSquare(null);
    }

    const squareDivs: JSX.Element[] = [];
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            const squareName = `${String.fromCharCode(97 + col)}${String(8 - row)}`
            const isSquareSelected = squareName === selectedFromSquare?.algebraicNotation;
            squareDivs.push(
                (<Square key={row * 8 + col}
                    isLight={(row % 2) === (col % 2)}
                    boardSquare={new BoardSquare(col + 1, 8 - row)}
                    isHighlighed={isSquareSelected}
                    handleClick={onSquareSelected} />)
            )
        }
    }

    const pieceElements: JSX.Element[] = [];
    gameBoard.forEachOccupiedSquare(os => pieceElements.push(
        <Piece key={os.square.index} occupiedSquare={os} />
    ));

    return (
        <div className="boardgrid">
            {squareDivs}
            {pieceElements}
        </div>
    )
}

export default Game;