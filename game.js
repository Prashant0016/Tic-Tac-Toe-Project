const PLAYER = 'X';
const COMPUTER = 'O';
const WINNING_COMBOS = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];

let board;
let currentPlayer;
let playerScore = 0;
let computerScore = 0;
let autoPlay = false; 

const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const roundResultElement = document.getElementById('round-result');

function startGame() {
    board = Array.from(Array(9).keys()).map(() => '');
    currentPlayer = PLAYER;
    roundResultElement.textContent = 'RESULT -';
    clearBoard();
    addClickHandlers();
}

function clearBoard() {
    const cells = document.querySelectorAll('.col');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '';
    });
}

function cellClicked(cell) {
    if (!autoPlay && currentPlayer === PLAYER) {
        const cellId = parseInt(cell.id);
        if (board[cellId - 1] === '') {
            board[cellId - 1] = currentPlayer;
            cell.textContent = currentPlayer;
            if (checkWin(board, currentPlayer)) {
                handleWin(currentPlayer);
            } else if (checkDraw(board)) {
                roundResultElement.textContent = 'RESULT - It\'s a draw!';
                setTimeout(() => {
                    startGame();
                }, 1000);
            } else {
                currentPlayer = COMPUTER;
                setTimeout(computerTurn, 500);
            }
        }
    }
}

function computerTurn() {
    if (autoPlay || currentPlayer === COMPUTER) {
        let availableMoves = board.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        board[randomMove] = COMPUTER;
        document.getElementById(randomMove + 1).textContent = COMPUTER;
        if (checkWin(board, COMPUTER)) {
            handleWin(COMPUTER);
        } else if (checkDraw(board)) {
            roundResultElement.textContent = 'RESULT - It\'s a draw!';
            setTimeout(() => {
                startGame();
            }, 1000);
        } else {
            currentPlayer = PLAYER;
            roundResultElement.textContent = 'RESULT -';
        }
    }
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i + 1) : a, []);
    let gameWon = null;
    for (let [index, win] of WINNING_COMBOS.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function handleWin(player) {
    if (player === PLAYER) {
        playerScore++;
        playerScoreElement.textContent = playerScore;
        roundResultElement.textContent = 'RESULT - You won!';
    } else {
        computerScore++;
        computerScoreElement.textContent = computerScore;
        roundResultElement.textContent = 'RESULT - Computer won!';
    }
    setTimeout(() => {
        startGame();
    }, 1000);
}

function checkDraw(board) {
    return board.every(cell => cell !== '');
}

function addClickHandlers() {
    const cells = document.querySelectorAll('.col');
    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            cellClicked(this);
        });
    });
}

startGame();
