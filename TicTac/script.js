// Создание игрового поля
const board = document.getElementById('board')
const cells = []
let currentPlayer = 'X'
let gameEnded = false

// Создание ячеек игрового поля
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.dataset.row = i
        cell.dataset.col = j
        cell.addEventListener('click', makeMove)
        cells.push(cell)
        board.appendChild(cell)
    }
}

// Функция обработки хода игрока
function makeMove() {
    if (gameEnded) return

    if (!this.textContent) {
        this.textContent = currentPlayer

        if (checkWin(currentPlayer)) {
            endGame(currentPlayer)
        } else if (checkDraw()) {
            endGame('draw')
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X' // Смена текущего игрока
        }
    }
}

// Функция проверки выигрышной комбинации
function checkWin(player) {
    const rows = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
    ]
    const cols = [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
    ]
    const diagonals = [
        [0, 4, 8],
        [2, 4, 6],
    ]

    return (
        rows.some(row =>
            row.every(cell => cells[cell].textContent === player)
        ) ||
        cols.some(col =>
            col.every(cell => cells[cell].textContent === player)
        ) ||
        diagonals.some(diagonal =>
            diagonal.every(cell => cells[cell].textContent === player)
        )
    )
}

// Функция проверки ничьей
function checkDraw() {
    return cells.every(cell => cell.textContent)
}

// Функция завершения игры
function endGame(result) {
    gameEnded = true

    if (result === 'draw') {
        alert('Ничья!')
    } else {
        alert(`Игрок ${result} победил!`)
    }
}

// Обработчик кнопки "Новая игра"
document.getElementById('newGameBtn').addEventListener('click', () => {
    // Очистка игрового поля
    cells.forEach(cell => {
        cell.textContent = ''
    })

    // Сброс текущего игрока и состояния игры
    currentPlayer = 'X'
    gameEnded = false
})
