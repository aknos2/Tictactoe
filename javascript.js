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

    return {getBoard, render, updateBoard};
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
    };

    return {start, createPlayer, handleClick};
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