//import 'zone.js'
//import 'reflect-metadata';
import * as Chess from './app/engine/ChessElements'
import { ComputerPlayer } from './app/engine/Evaluation';

const thisSelf = self;

onmessage = function (event) {

    // const id = Math.round(Math.random() * 1000000);

    Chess.BoardResources.init();

    // Marshall the Board object that we have been sent.
    const board: Chess.Board = Object.assign(new Chess.Board(), event.data);

    // Prepare a player object that will calculate the next move and tell us about its progress.
    const computerPlayer = new ComputerPlayer();
    computerPlayer.calculationProgress$.subscribe((progressPercentage: number) => {
        thisSelf.postMessage("PROGRESS:" + progressPercentage);
    });

    const selectedMove = computerPlayer.getBestMove(board);

    // Send our selected move back to the main thread.
    thisSelf.postMessage(selectedMove);
}
