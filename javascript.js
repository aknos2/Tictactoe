"use strict";

const startButton = document.querySelector("#submit-btn");
const restartButton = document.querySelector("#restart-button");


const GameBoard = (() => {
    const board = ['','','','','','','','',''];

    const getBoard = () => board;

    const render = () => {
        let boardHTML = "";
        board.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        });
        document.querySelector("#gameboard").innerHTML = boardHTML;
        //add click event listener to all squares
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        });
    };

    const updateBoard = (index, value) => {
        board[index] = value;
        render();
    };

    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    };

    return {getBoard, render, updateBoard, renderMessage};
})()

const Game = (() => {
    const namePanel = document.querySelector("#name-panel");
    const player1turn = document.querySelector("#player1-turn");
    const player2turn = document.querySelector("#player2-turn");
    const player1Panel = document.querySelector("#player1-panel");
    const player2Panel = document.querySelector("#player2-panel");

    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        const player1Name = document.querySelector("#player1").value || "Player 1";
        const player2Name = document.querySelector("#player2").value || "Player 2";

        players = [
            createPlayer(player1Name, "X"),
            createPlayer(player2Name, "O")
        ];

        currentPlayerIndex = 0;
        gameOver = false;
        namePanel.style.visibility = "hidden";
        restartButton.style.display = "block";
   
        GameBoard.render();
        // Initialize turn display
        player1turn.innerHTML = `${player1Name}'s turn`;
        transition(player1Panel);
    };

    const createPlayer = (name, mark) => {
        return {name, mark};
    };

    const handleClick = (event) => {
        if (gameOver) {
            return;
        }
        //get the square index number. Split into an array, [1] to get the id number from ["square", "id"]
        let index = parseInt(event.target.id.split("-")[1]);
        //prevents overwrite
        if (GameBoard.getBoard()[index] !== "") {
            return;
        }
        //get the player's mark
        GameBoard.updateBoard(index, players[currentPlayerIndex].mark);
        //save current player index's name before switching
        const currentPlayerName = players[currentPlayerIndex].name;
        //switch player
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        if (currentPlayerIndex === 0) {
            transition(player1Panel);
            transitionOff(player2Panel);
            player1turn.innerHTML = `${players[0].name}'s turn`;
        } else {
            transition(player2Panel);
            transitionOff(player1Panel);
            player2turn.innerHTML = `${players[1].name}'s turn`;
        }
        //check win or draw condition
        const winningSequence = Rules.checkForWin(GameBoard.getBoard());
        if (winningSequence) {
            transitionOff(player1Panel);
            transitionOff(player2Panel);
            gameOver = true;
            GameBoard.renderMessage(`${currentPlayerName} wins!`);
            //highlight winning squares
            winningSequence.forEach((squareIndex) => {
                const squareElement = document.getElementById(`square-${squareIndex}`);
                squareElement.classList.add("winning-marks");
            })

        } else if (Rules.checkForDraw(GameBoard.getBoard())) {
            transitionOff(player1Panel);
            transitionOff(player2Panel);
            gameOver = true;
            GameBoard.renderMessage("It's a draw!");
        };
    };

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            GameBoard.updateBoard(i, "");
        };
        gameOver = false;
        transitionOff(player1Panel);
        transitionOff(player2Panel);
        GameBoard.renderMessage("");
        namePanel.style.visibility = "visible";
        restartButton.style.display = "none";
        GameBoard.render();
    };

    const transition = (player) => {
        player.style.opacity = "1";
        player.style.transition = "opacity 0.3s";
    }

    const transitionOff = (player) => {
        player.style.opacity = "0";
    }

    return {start, createPlayer, handleClick, restart, transition, transitionOff};
})()

const Rules = (() => {
    const checkForWin = (board) => {
        const winningCombinations = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6]
        ]
        for (let i = 0; i < winningCombinations.length; i++) {
          //destructuring
          const [a,b,c] = winningCombinations[i];
          //check if "X" or "O" are equal
          if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return [a,b,c];
          }
        };
        return null;
    };

    const checkForDraw = (board) => {
        return board.every((cell) => cell !== "");
    };

    return {checkForDraw, checkForWin};
})()


startButton.addEventListener("click", () => {
    Game.start();
    document.body.style.background = "rgba(18, 32, 76, 0.6)";
})

restartButton.addEventListener("click", () => {
    Game.restart();
    document.body.style.background = "var(--background-color)"
})

