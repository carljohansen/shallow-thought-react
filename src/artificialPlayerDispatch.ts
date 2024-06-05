//import 'zone.js'
//import 'reflect-metadata';
import * as Chess from './app/engine/ChessElements'
import { ComputerPlayer } from './app/engine/Evaluation';

/* eslint-disable-next-line no-restricted-globals */
const thisSelf = self as any;

onmessage = function (event) {

    const id = Math.round(Math.random() * 1000000);

    Chess.BoardResources.init();

    // Marshall the Board object that we have been sent.
    var board: Chess.Board = Object.assign(new Chess.Board(), event.data);

    // Prepare a player object that will calculate the next move and tell us about its progress.
    var computerPlayer = new ComputerPlayer();
    computerPlayer.calculationProgress$.subscribe((progressPercentage: any) => {
        thisSelf.postMessage("PROGRESS:" + progressPercentage);
    });

    var selectedMove = computerPlayer.getBestMove(board);

    // Send our selected move back to the main thread.
    /* eslint-disable-next-line no-restricted-globals */
    thisSelf.postMessage(selectedMove);
}
