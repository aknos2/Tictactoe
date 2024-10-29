"use strict";

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
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1"), "X"),
            createPlayer(document.querySelector("#player2"), "O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        GameBoard.render();
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
        //switch player
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        //check win or draw condition
        if (Rules.checkForWin(GameBoard.getBoard())) {
            gameOver = true;
            GameBoard.renderMessage(`${players[currentPlayerIndex].value} wins!`);
            console.log("win")
        } else if (Rules.checkForDraw(GameBoard.getBoard())) {
            gameOver = true;
            GameBoard.renderMessage("It's a draw!");
        };
    };

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            GameBoard.updateBoard(i, "");
            gameOver = false;
            GameBoard.renderMessage("");
        };
    };

    return {start, createPlayer, handleClick, restart};
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
            return true;
          }
        };
        return false;
    };

    const checkForDraw = (board) => {
        return board.every((cell) => cell !== "");
    };

    return {checkForDraw, checkForWin};
})()

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
  Game.start();
  startButton.disabled = true;
})

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
  Game.restart();
  startButton.disabled = false;
  document.querySelector("#gameboard").innerHTML = "";
})