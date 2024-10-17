"use strict";

// Game board factory
function gameBoard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    // Initialize the 3x3 board with Cell objects
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    // Choose cell and mark it with player's mark
    const chooseCell = (row, column, player) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].addMark(player);
            console.log(`Player ${player} marked cell at row ${row}, column ${column}`);
            return true;
        } else {
            console.log("Cell is already marked. Choose another cell.");
            return false;
        }
    };

    // Print the board in a readable format
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return { getBoard, chooseCell, printBoard };
}

// Cell factory
function Cell() {
    let value = 0;

    // Mark the cell with player's mark
    const addMark = (player) => {
        if (value === 0) {
            value = player;
        }
    };

    const getValue = () => value;

    return { addMark, getValue };
}

// GameController factory for handling player turns and game state
function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = gameBoard();

    // Define two players
    const players = [
        {
            name: playerOneName,
            mark: "X"
        },
        {
            name: playerTwoName,
            mark: "O"
        }
    ];

    let activePlayer = players[0];

    // Switch the current player's turn
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Get the current active player
    const getActivePlayer = () => activePlayer;

    // Print the current game board and player
    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    // Play a round of the game by marking the chosen cell
    const playRound = (row, column) => {
        if (board.chooseCell(row, column, getActivePlayer().mark)) {
            switchPlayerTurn();
        }
        printNewRound();
    };

    printNewRound();

    return { playRound, getActivePlayer };
}

// Initialize the game controller
const gameController = GameController();

// Test: Play some rounds
gameController.playRound(0, 0); // Player 1 marks (0,0)
gameController.playRound(0, 1); // Player 2 marks (0,1)
gameController.playRound(1, 1); // Player 1 marks (1,1)
gameController.playRound(0, 0); // Invalid move: cell already marked
gameController.playRound(2, 2); // Player 2 marks (2,2)
