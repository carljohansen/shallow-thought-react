import * as Chess from './app/engine/ChessElements'
import './app/ui/css/game.component.css';
import { FC, useState } from 'react';
import Square from './Square';
import { BoardSquare, GameMove } from './app/engine/ChessElements';
import Piece from './Piece';

export type SquareSelectedEvent = CustomEvent<BoardSquare>;

export type MoveSelectedEvent = CustomEvent<GameMove>;

interface GameProps {
    gameBoard: Chess.Board,
    orientation: Chess.Player,
    handleMoveInput: (e: MoveSelectedEvent) => void
}

const Game: FC<GameProps> = ({ gameBoard, orientation, handleMoveInput }) => {

    const [selectedFromSquare, setSelectedFromSquare] = useState<BoardSquare | null>(null);

    const onSquareSelected = (event: SquareSelectedEvent) => {
        const selectedSquare = event.detail;
        if (event.type === "squareSelected") {
            if (selectedFromSquare) {
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
        if (validatedMove) {
            handleMoveInput(new CustomEvent("humanMove", { detail: validatedMove }));
        } else {
            console.log("Invalid move!")
        }

        setSelectedFromSquare(null);
    }

    const squareDivs: JSX.Element[] = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const file = (orientation === Chess.Player.White ? col + 1 : 8 - col);
            const rank = (orientation === Chess.Player.White ? 8 - row : row + 1);
            const squareName = `${String.fromCharCode(96 + file)}${String(rank)}`
            const isSquareSelected = squareName === selectedFromSquare?.algebraicNotation;
            squareDivs.push(
                (<Square key={row * 8 + col}
                    isLight={(row % 2) === (col % 2)}
                    boardSquare={new BoardSquare(file, rank, orientation)}
                    isHighlighed={isSquareSelected}
                    handleClick={onSquareSelected} />)
            )
        }
    }

    const pieceElements: JSX.Element[] = [];
    gameBoard.forEachOccupiedSquareBeforeAnimation((os, animation) => pieceElements.push(
        <Piece key={os.square.index + "_" + os.piece.piece + "_" + os.piece.player}
            occupiedSquare={os}
            animatingMove={animation}
            orientation={orientation} />),
        orientation,
        gameBoard.newMoveAnimation);

    return (
        <div className="boardgrid">
            {squareDivs}
            {pieceElements}
        </div>
    )
}

export default Game;